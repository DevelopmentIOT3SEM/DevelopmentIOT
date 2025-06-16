from flask import Flask, jsonify
from flask_cors import CORS
import requests
import numpy as np
from datetime import datetime, timedelta
import pandas as pd

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

BASE_URL_ASPNET = "http://localhost:5271/api"

def fetch_from_aspnet(endpoint):
    try:
        response = requests.get(f"{BASE_URL_ASPNET}/{endpoint}")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": f"Erro ao consultar {endpoint}: {str(e)}"}, 500

def get_turno(timestamp):
    try:
        hora = datetime.fromisoformat(timestamp.replace('Z', '+00:00')).hour
        if 6 <= hora < 14:
            return "Manhã"
        elif 14 <= hora < 22:
            return "Tarde"
        else:
            return "Noite"
    except ValueError:
        return "Desconhecido"

def get_real_umidade():
    try:
        response = requests.get(
            "https://api.weatherapi.com/v1/current.json",
            params={"key": "f18fc45c8a3d4b8296e180450251206", "q": "Sao Paulo"}
        )
        response.raise_for_status()
        data = response.json()
        return data["current"]["humidity"]
    except requests.RequestException as e:
        print(f"Erro ao obter umidade: {e}")
        return np.random.randint(0, 8)

def calcular_tempo_ligada_e_parada(monitoramento_data):
    esteira_data = [reg for reg in monitoramento_data if reg.get("idSensor") == 3]
    if not esteira_data:
        return "00:00:00", "N/A"
    
    total_tempo_ligada = timedelta()
    ultima_parada = "N/A"
    
    try:
        esteira_data = sorted(esteira_data, key=lambda x: x.get("timestampMonitoramento", ""))
        for i, registro in enumerate(esteira_data):
            if registro.get("estado") == "on":
                inicio = datetime.fromisoformat(registro["timestampMonitoramento"].replace('Z', '+00:00'))
                fim = (datetime.fromisoformat(esteira_data[i+1]["timestampMonitoramento"].replace('Z', '+00:00'))
                    if i+1 < len(esteira_data)
                    else datetime.now())
                total_tempo_ligada += fim - inicio
            elif registro.get("estado") == "off" and ultima_parada == "N/A":
                ultima_parada = datetime.fromisoformat(registro["timestampMonitoramento"].replace('Z', '+00:00')).strftime("%d/%m/%Y às %H:%M")
    except (ValueError, KeyError) as e:
        print(f"Erro ao processar monitoramento: {e}")
    
    total_segundos = int(total_tempo_ligada.total_seconds())
    horas = total_segundos // 3600
    minutos = (total_segundos % 3600) // 60
    segundos = total_segundos % 60
    tempo_ligada = f"{horas:02d}:{minutos:02d}:{segundos:02d}"
    
    return tempo_ligada, ultima_parada

def get_latest_sensor_states(monitoramento_data):
    sensor_states = {
        1: False,  
        2: False,  
        3: False   
    }
    
    processed_sensors = set()  
    print("Monitoramento Data recebido:", monitoramento_data)  
    
    for registro in reversed(monitoramento_data):
        id_sensor = registro.get("idSensor")
        if id_sensor in sensor_states and id_sensor not in processed_sensors:
            sensor_states[id_sensor] = registro.get("estado") == "on"
            processed_sensors.add(id_sensor)
            print(f"Processando sensor {id_sensor} com estado {registro.get('estado')} em {registro.get('timestampMonitoramento')}")
    
    print("Estados finais dos sensores:", sensor_states)  
    return sensor_states

@app.route('/api/dados', methods=['GET'])
def get_dados():
    pecas_data = fetch_from_aspnet("Peca")
    producao_data = fetch_from_aspnet("Producao")
    monitoramento_data = fetch_from_aspnet("Monitoramento")
    refugos_data = fetch_from_aspnet("Producao/refugos")

    if isinstance(pecas_data, dict) and "error" in pecas_data:
        return jsonify(pecas_data), 500
    if isinstance(producao_data, dict) and "error" in producao_data:
        return jsonify(producao_data), 500
    if isinstance(monitoramento_data, dict) and "error" in monitoramento_data:
        return jsonify(monitoramento_data), 500
    if isinstance(refugos_data, dict) and "error" in refugos_data:
        return jsonify(refugos_data), 500

    peca_map = {peca["idPeca"]: peca["tipoMaterial"] for peca in pecas_data if "idPeca" in peca and "tipoMaterial" in peca}

    tempo_ligada, ultima_parada = calcular_tempo_ligada_e_parada(monitoramento_data)
    sensor_states = get_latest_sensor_states(monitoramento_data)

    erros = 0
    df_producao = pd.DataFrame(producao_data)
    if not df_producao.empty:
        df_producao["tipo_material"] = df_producao["idPeca"].map(peca_map)
        for _, row in df_producao.iterrows():
            if pd.isna(row["tipo_material"]):
                continue
            rampa_correta = 1 if row["tipo_material"] == "Metálica" else 2 if row["tipo_material"] == "Plástica" else 3
            if row["rampa"] != rampa_correta:
                erros += 1

    linhas = []
    if not df_producao.empty:
        df_producao["data"] = df_producao["timestampProducao"].apply(lambda x: datetime.fromisoformat(x.replace('Z', '+00:00')).strftime('%Y-%m-%d'))
        df_producao["turno"] = df_producao["timestampProducao"].apply(get_turno)

        grouped = df_producao.groupby(["data", "turno", "tipo_material"])

        for (data, turno, tipo_material), grupo in grouped:
            total_processado = len(grupo)
            rampa_correta = 1 if tipo_material == "Metálica" else 2 if tipo_material == "Plástica" else 3
            corretamente_separado = len(grupo[grupo["rampa"] == rampa_correta])
            mal_separado = total_processado - corretamente_separado
            tempo_total_processamento = np.random.uniform(200, 800)
            material_descartado_indev = len(grupo[grupo["rampa"] == 3]) if tipo_material != "Refugo" else 0
            tempo_operacional = np.random.uniform(50, 60)
            tempo_total_disponivel = 60.0
            acertos_algoritmo = int(total_processado * np.random.uniform(0.88, 0.98))
            erro_plastico_como_metal = len(grupo[(grupo["tipo_material"] == "Plástica") & (grupo["rampa"] == 1)])
            erro_metal_como_plastico = len(grupo[(grupo["tipo_material"] == "Metálica") & (grupo["rampa"] == 2)])
            umidade = get_real_umidade()

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
                "esteira_lig": sensor_states[3],
                "atuador1": sensor_states[1],
                "atuador2": sensor_states[2],
                "tempoLigada": tempo_ligada,
                "ultimaParada": ultima_parada,
                "erros": erros
            })

    if not linhas:
        linhas.append({
            "data": datetime.now().strftime('%Y-%m-%d'),
            "turno": "Desconhecido",
            "tipo_material": "N/A",
            "total_processado": 0,
            "corretamente_separado": 0,
            "mal_separado": 0,
            "tempo_total_processamento": 0.0,
            "material_descartado_indev": 0,
            "tempo_operacional": 0.0,
            "tempo_total_disponivel": 60.0,
            "acertos_algoritmo": 0,
            "erro_plastico_como_metal": 0,
            "erro_metal_como_plastico": 0,
            "umidade": 0,
            "esteira_lig": False,
            "atuador1": False,
            "atuador2": False,
            "tempoLigada": "00:00:00",
            "ultimaParada": "N/A",
            "erros": 0
        })

    return jsonify(linhas)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)