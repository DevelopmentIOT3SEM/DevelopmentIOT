from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

@app.route('/api/dados')
def get_dados():

    np.random.seed(42)
    turnos = ['Manhã', 'Tarde', 'Noite']
    tipos_materiais = ['Plástico', 'Metal']
    data_inicial = datetime(2025, 3, 1)
    dias = 30
    linhas = []

    for dia in range(dias):
        for turno in turnos:
            for _ in range(3):
                data = data_inicial + timedelta(days=dia)
                tipo_material = random.choice(tipos_materiais)
                total_processado = np.random.randint(100, 300)
                corretamente_separado = int(total_processado * np.random.uniform(0.85, 0.99))
                mal_separado = total_processado - corretamente_separado
                reciclavel_kg = total_processado * np.random.uniform(0.8, 1.2)
                tempo_total_processamento = np.random.uniform(200, 800)
                material_descartado_indev = np.random.randint(0, 10)
                tempo_operacional = np.random.uniform(50, 60)
                tempo_total_disp = 60
                acertos_algoritmo = int(total_processado * np.random.uniform(0.88, 0.98))
                erro_plastico_como_metal = np.random.randint(0, mal_separado + 1)
                erro_metal_como_plastico = mal_separado - erro_plastico_como_metal
                umidade = np.random.randint(0, 8)
                esteira_lig = True
                atuadores = False

                linhas.append({
                    'data': data.strftime('%Y-%m-%d'),
                    'turno': turno,
                    'tipo_material': tipo_material,
                    'total_processado': total_processado,
                    'corretamente_separado': corretamente_separado,
                    'mal_separado': mal_separado,
                    'reciclavel_kg': round(reciclavel_kg, 2),
                    'tempo_total_processamento': round(tempo_total_processamento, 2),
                    'material_descartado_indev': material_descartado_indev,
                    'tempo_operacional': round(tempo_operacional, 2),
                    'tempo_total_disponivel': tempo_total_disp,
                    'acertos_algoritmo': acertos_algoritmo,
                    'erro_plastico_como_metal': erro_plastico_como_metal,
                    'erro_metal_como_plastico': erro_metal_como_plastico,
                    'umidade': umidade,
                    'esteira_lig': esteira_lig,
                    'atuadores': atuadores
                })


    return jsonify(linhas)

if __name__ == '__main__':
    app.run(debug=True)
