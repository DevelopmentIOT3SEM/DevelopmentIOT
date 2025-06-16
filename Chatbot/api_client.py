import requests
from datetime import datetime

API_BASE_URL = "http://localhost:5271/api"

def get_status_sensores() -> str:
    try:
        sensores_res = requests.get(f"{API_BASE_URL}/Sensor")
        monitoramento_res = requests.get(f"{API_BASE_URL}/Monitoramento")

        sensores_res.raise_for_status()
        monitoramento_res.raise_for_status()

        sensores = sensores_res.json()
        monitoramentos = monitoramento_res.json()

        # Dicionário para armazenar o monitoramento mais recente por sensor
        ultimo_estado_por_sensor = {}

        for entrada in monitoramentos:
            sensor_id = entrada["idSensor"]
            timestamp = entrada["timestampMonitoramento"]

            if sensor_id not in ultimo_estado_por_sensor or timestamp > ultimo_estado_por_sensor[sensor_id]["timestamp"]:
                ultimo_estado_por_sensor[sensor_id] = {
                    "estado": entrada["estado"],
                    "timestamp": timestamp
                }

        # Montar a resposta
        resposta = ""
        for sensor in sensores:
            nome = sensor["nome"]
            sensor_id = sensor["idSensor"]
            estado = ultimo_estado_por_sensor.get(sensor_id, {}).get("estado", "desconhecido")
            resposta += f"{nome}: {estado}\n"

        return resposta.strip()

    except Exception as e:
        return f"Erro ao buscar status dos sensores: {str(e)}"

def get_volume_processado():
    response = requests.get(f"{API_BASE_URL}/producao")
    data = response.json()
    return f"Volume total processado: {len(data)} peças."

def get_total_operacoes():
    response = requests.get(f"{API_BASE_URL}/producao")
    data = response.json()
    return f"Total de operações registradas: {len(data)}."

def get_total_refugos():
    response = requests.get(f"{API_BASE_URL}/producao/refugos")
    data = response.json()
    return f"Total de peças com defeito (refugos): {len(data)}."

def get_taxa_refugo():
    producao = requests.get(f"{API_BASE_URL}/producao").json()
    refugos = requests.get(f"{API_BASE_URL}/producao/refugos").json()

    total_produzido = len(producao)
    total_refugado = len(refugos)

    if total_produzido == 0:
        return "Ainda não há produção registrada."

    taxa = (total_refugado / total_produzido) * 100
    return f"Taxa de refugo: {taxa:.2f}%"

def get_total_pecas_plasticas():
    try:
        response = requests.get(f"{API_BASE_URL}/producao")
        response.raise_for_status()
        data = response.json()
        total = sum(1 for item in data if item.get("idTipoPeca") == 1)
        return f"Total de peças plásticas produzidas: {total}."
    except Exception as e:
        return f"Erro ao obter peças plásticas: {e}"

def get_total_pecas_metalicas():
    try:
        response = requests.get(f"{API_BASE_URL}/producao")
        response.raise_for_status()
        data = response.json()
        total = sum(1 for item in data if item.get("idTipoPeca") == 2)
        return f"Total de peças metálicas produzidas: {total}."
    except Exception as e:
        return f"Erro ao obter peças metálicas: {e}"
    
def get_info_pecas_por_tempo(mensagem: str) -> str:
    try:
        response = requests.get(f"{API_BASE_URL}/producao")
        response.raise_for_status()
        data = response.json()

        if not data:
            return "Nenhuma peça foi produzida ainda."

        data.sort(key=lambda x: x.get("timestampProducao", ""), reverse=True)
        mensagem = mensagem.lower()

        # Última peça
        if "última peça" in mensagem or "ultima peça" in mensagem:
            ultima = data[0]
            return f"A última peça foi produzida em {ultima['timestampProducao']}."

        # Últimas N peças
        if "últimas" in mensagem or "ultimas" in mensagem:
            import re
            match = re.search(r"(\d+)", mensagem)
            if match:
                qtd = int(match.group(1))
                ultimas = data[:qtd]
                resposta = [f"{i+1}ª peça: {item['timestampProducao']}" for i, item in enumerate(ultimas)]
                return "Datas das últimas peças:\n" + "\n".join(resposta)

        # Procurar por data específica (formato DD/MM/AAAA)
        import re
        match_data = re.search(r"(\d{2}/\d{2}/\d{4})", mensagem)
        if match_data:
            data_str = match_data.group(1)
            try:
                dt_input = datetime.strptime(data_str, "%d/%m/%Y").date()
            except ValueError:
                return f"Formato de data inválido: {data_str}. Use DD/MM/AAAA."

            filtradas = []
            for item in data:
                timestamp = item.get("timestampProducao")
                if not timestamp:
                    continue
                try:
                    dt_item = datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%S.%f").date()
                    if dt_item == dt_input:
                        filtradas.append(item)
                except Exception as e:
                    print(f"Erro ao converter timestamp: {timestamp} → {e}")
                    continue

            if not filtradas:
                return f"Nenhuma peça foi produzida em {data_str}."

            resposta = [f"{i+1}ª peça: {item['timestampProducao']}" for i, item in enumerate(filtradas)]
            return f"Peças produzidas em {data_str}:\n" + "\n".join(resposta)

        return "Por favor, especifique se deseja a última peça, as últimas N peças ou uma data específica (ex: 25/05/2025)."

    except Exception as e:
        return f"Erro ao processar dados de produção: {e}"