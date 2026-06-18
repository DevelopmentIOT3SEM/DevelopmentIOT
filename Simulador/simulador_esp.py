"""Simulador de ESP da esteira de reciclagem.

Emula o microcontrolador que lê os sensores e dispara na API .NET, peça a peça:

1. Define o estado dos sensores (Atuador 1 = metal, Atuador 2 = plástico,
   Esteira) via POST /api/Monitoramento.
2. Chama POST /api/Processamento/processar-peca informando o material esperado.
   O backend compara o que os sensores detectaram com o esperado e decide a
   rampa (1 = metálica, 2 = plástica, 3 = refugo).

Uma fração das peças (--taxa-erro) tem leitura divergente do esperado, gerando
refugos — como aconteceria numa linha real.

Uso:
    python simulador_esp.py --quantidade 120 --intervalo 0.1
    python simulador_esp.py --api http://localhost:5271 --taxa-erro 0.15
"""
import argparse
import json
import random
import sys
import time
import urllib.error
import urllib.request

# Garante saída em UTF-8 mesmo em consoles Windows (cp1252).
try:
    sys.stdout.reconfigure(encoding="utf-8")
except (AttributeError, ValueError):
    pass

MATERIAIS = ["Metálica", "Plástica"]

SENSOR_METAL = 1
SENSOR_PLASTICO = 2
SENSOR_ESTEIRA = 3


def _post(url: str, payload: dict, timeout: float = 10.0):
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url, data=data, headers={"Content-Type": "application/json"}, method="POST"
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        corpo = resp.read().decode("utf-8")
        return resp.status, (json.loads(corpo) if corpo else None)


def simular(api: str, quantidade: int, intervalo: float, taxa_erro: float) -> None:
    mon_url = f"{api}/api/Monitoramento"
    proc_url = f"{api}/api/Processamento/processar-peca"

    contagem = {"Metálica": 0, "Plástica": 0, "Refugo": 0, "falhas": 0}
    print(f"▶ Simulando {quantidade} peças contra {api} (taxa de erro {taxa_erro:.0%})\n")

    for i in range(1, quantidade + 1):
        esperado = random.choice(MATERIAIS)

        # Leitura do sensor: normalmente bate com o esperado; às vezes erra
        # (detecta o outro material ou nada → vira refugo).
        if random.random() < taxa_erro:
            detectado = random.choice([m for m in MATERIAIS if m != esperado] + [None])
        else:
            detectado = esperado

        estado_metal = "on" if detectado == "Metálica" else "off"
        estado_plastico = "on" if detectado == "Plástica" else "off"

        try:
            _post(mon_url, {"idSensor": SENSOR_METAL, "estado": estado_metal})
            _post(mon_url, {"idSensor": SENSOR_PLASTICO, "estado": estado_plastico})
            _post(mon_url, {"idSensor": SENSOR_ESTEIRA, "estado": "on"})

            _, resp = _post(proc_url, {"tipoMaterialEsperado": esperado})
            rampa = resp.get("rampa") if isinstance(resp, dict) else None
            destino = {1: "Metálica", 2: "Plástica", 3: "Refugo"}.get(rampa, "?")
            if destino in contagem:
                contagem[destino] += 1
            print(f"[{i:>4}/{quantidade}] esperado={esperado:<9} "
                  f"detectado={str(detectado):<9} → rampa {rampa} ({destino})")
        except (urllib.error.URLError, urllib.error.HTTPError) as e:
            contagem["falhas"] += 1
            print(f"[{i:>4}/{quantidade}] falha ao chamar a API: {e}")

        if intervalo > 0:
            time.sleep(intervalo)

    print("\n✔ Fim da simulação:")
    for chave, valor in contagem.items():
        print(f"   {chave}: {valor}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Simulador de ESP da esteira de reciclagem.")
    parser.add_argument("--api", default="http://localhost:5271", help="URL base da API .NET")
    parser.add_argument("--quantidade", type=int, default=120, help="Quantidade de peças a simular")
    parser.add_argument("--intervalo", type=float, default=0.1, help="Intervalo (s) entre peças")
    parser.add_argument("--taxa-erro", type=float, default=0.12, help="Fração de peças com erro (0-1)")
    args = parser.parse_args()

    simular(args.api, args.quantidade, args.intervalo, args.taxa_erro)


if __name__ == "__main__":
    main()
