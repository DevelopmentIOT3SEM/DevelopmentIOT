from flask import Flask, jsonify
from flask_cors import CORS
import requests
import numpy as np
from datetime import datetime, timedelta
import pandas as pd

app = Flask(__name__)
CORS(app)

# URL base da API ASP.NET
BASE_URL_ASPNET = "http://localhost:5271/api"  # Substitua pela URL real

# Função auxiliar para fazer chamadas à API ASP.NET
def fetch_from_aspnet(endpoint):
    try:
        response = requests.get(f"{BASE_URL_ASPNET}/{endpoint}")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": f"Erro ao consultar {endpoint}: {str(e)}"}, 500

# Função para determinar o turno com base no horário
def get_turno(timestamp):
    hora = datetime.fromisoformat(timestamp).hour
    if 6 <= hora < 14:
        return "Manhã"
    elif 14 <= hora < 22:
        return "Tarde"
    else:
        return "Noite"

@app.route('/api/dados', methods=['GET'])
def get_dados():
    # Buscar dados da API ASP.NET
    pecas_data = fetch_from_aspnet("Peca")
    producao_data = fetch_from_aspnet("Producao")
    monitoramento_data = fetch_from_aspnet("Monitoramento")
    refugos_data = fetch_from_aspnet("Producao/refugos")

    # Verificar se houve erro nas chamadas
    if isinstance(pecas_data, dict) and "error" in pecas_data:
        return jsonify(pecas_data), 500
    if isinstance(producao_data, dict) and "error" in producao_data:
        return jsonify(producao_data), 500
    if isinstance(monitoramento_data, dict) and "error" in monitoramento_data:
        return jsonify(monitoramento_data), 500
    if isinstance(refugos_data, dict) and "error" in refugos_data:
        return jsonify(refugos_data), 500

    # Mapear idPeca para tipo_material
    peca_map = {peca["idPeca"]: peca["tipoMaterial"] for peca in pecas_data}

    # Processar dados de produção por data e turno
    linhas = []
    df_producao = pd.DataFrame(producao_data)
    if not df_producao.empty:
        # Adicionar tipo_material e turno
        df_producao["tipo_material"] = df_producao["idPeca"].map(peca_map)
        df_producao["data"] = df_producao["timestampProducao"].apply(lambda x: datetime.fromisoformat(x).strftime('%Y-%m-%d'))
        df_producao["turno"] = df_producao["timestampProducao"].apply(get_turno)

        # Agrupar por data, turno e tipo_material
        grouped = df_producao.groupby(["data", "turno", "tipo_material"])

        for (data, turno, tipo_material), grupo in grouped:
            total_processado = len(grupo)
            rampa_correta = 1 if tipo_material == "Metálica" else 2 if tipo_material == "Plástica" else 3
            corretamente_separado = len(grupo[grupo["rampa"] == rampa_correta])
            mal_separado = total_processado - corretamente_separado
            tempo_total_processamento = np.random.uniform(200, 800)
            material_descartado_indev = len(grupo[grupo["rampa"] == 3]) if tipo_material != "Refugo" else 0
            tempo_operacional = np.random.uniform(50, 60)
            acertos_algoritmo = int(total_processado * np.random.uniform(0.88, 0.98))
            tempo_total_disponivel = 60.0
            int(total_processado * np.random.uniform(0.88, 0.98))
            erro_plastico_como_metal = len(grupo[(grupo["tipo_material"] == "Plástica") & (grupo["rampa"] == 1)])
            erro_metal_como_plastico = len(grupo[(grupo["tipo_material"] == "Metálica") & (grupo["rampa"] == 2)])
            umidade = np.random.randint(0, 8)
            esteira_lig = monitoramento_data[0]["estado"] == "on" if monitoramento_data else True
            atuadores = False  # Valor fixo (não fornecido pela API)

            linhas.append({
                "data": data,
                "turno": turno,
                "tipo_material": tipo_material,
                "total_processado": total_processado,
                "corretamente_separado": corretamente_separado,
                "mal_separado": mal_separado,
                "tempo_total_processamento": round(tempo_total_processamento, 2),
                "material_descartado_indev": material_descartado_indev,
                "tempo_operacional": round(tempo_operacional, 2),
                "tempo_total_disponivel": tempo_total_disponivel,
                "acertos_algoritmo": acertos_algoritmo,
                "erro_plastico_como_metal": erro_plastico_como_metal,
                "erro_metal_como_plastico": erro_metal_como_plastico,
                "umidade": umidade,
                "esteira_lig": esteira_lig,
                "atuadores": atuadores
            })

    return jsonify(linhas)

if __name__ == '__main__':
    app.run(debug=True)