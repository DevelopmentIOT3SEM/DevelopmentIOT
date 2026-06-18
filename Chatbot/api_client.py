"""Cliente da API .NET de produção. Cada função devolve uma string pronta
para o usuário; falhas de rede são tratadas de forma uniforme e logadas."""
import logging
import re
from collections import Counter
from datetime import datetime

import requests

from config import API_BASE_URL, REQUEST_TIMEOUT

logger = logging.getLogger(__name__)

# IDs de peça conforme o seed do banco (Codigo_SQL/tabelas.sql).
ID_PECA_METALICA = 1
ID_PECA_PLASTICA = 2


def _get(path: str):
    """GET em {API_BASE_URL}/{path} com timeout; levanta em erro HTTP/rede."""
    response = requests.get(f"{API_BASE_URL}/{path}", timeout=REQUEST_TIMEOUT)
    response.raise_for_status()
    return response.json()


def get_status_sensores() -> str:
    try:
        sensores = _get("Sensor")
        monitoramentos = _get("Monitoramento")

        # Último estado conhecido de cada sensor.
        ultimo_estado_por_sensor = {}
        for entrada in monitoramentos:
            sensor_id = entrada["idSensor"]
            timestamp = entrada["timestampMonitoramento"]
            atual = ultimo_estado_por_sensor.get(sensor_id)
            if atual is None or timestamp > atual["timestamp"]:
                ultimo_estado_por_sensor[sensor_id] = {
                    "estado": entrada["estado"],
                    "timestamp": timestamp,
                }

        linhas = []
        for sensor in sensores:
            estado = ultimo_estado_por_sensor.get(sensor["idSensor"], {}).get("estado", "desconhecido")
            linhas.append(f"{sensor['nome']}: {estado}")
        return "\n".join(linhas).strip() or "Nenhum sensor cadastrado."
    except requests.RequestException as e:
        logger.warning("Falha ao buscar status dos sensores: %s", e)
        return "Não consegui consultar os sensores agora. Tente novamente em instantes."


def get_volume_processado() -> str:
    try:
        data = _get("producao")
        return f"Volume total processado: {len(data)} peças."
    except requests.RequestException as e:
        logger.warning("Falha ao buscar volume processado: %s", e)
        return "Não consegui consultar o volume processado agora."


def get_total_operacoes() -> str:
    try:
        data = _get("producao")
        return f"Total de operações registradas: {len(data)}."
    except requests.RequestException as e:
        logger.warning("Falha ao buscar total de operações: %s", e)
        return "Não consegui consultar o total de operações agora."


def get_total_refugos() -> str:
    try:
        data = _get("producao/refugos")
        return f"Total de peças com defeito (refugos): {len(data)}."
    except requests.RequestException as e:
        logger.warning("Falha ao buscar refugos: %s", e)
        return "Não consegui consultar os refugos agora."


def get_taxa_refugo() -> str:
    try:
        total_produzido = len(_get("producao"))
        total_refugado = len(_get("producao/refugos"))
        if total_produzido == 0:
            return "Ainda não há produção registrada."
        taxa = (total_refugado / total_produzido) * 100
        return f"Taxa de refugo: {taxa:.2f}%"
    except requests.RequestException as e:
        logger.warning("Falha ao calcular taxa de refugo: %s", e)
        return "Não consegui calcular a taxa de refugo agora."


def _contar_por_peca(id_peca: int) -> int:
    data = _get("producao")
    return sum(1 for item in data if item.get("idPeca") == id_peca)


def get_total_pecas_plasticas() -> str:
    try:
        return f"Total de peças plásticas produzidas: {_contar_por_peca(ID_PECA_PLASTICA)}."
    except requests.RequestException as e:
        logger.warning("Falha ao obter peças plásticas: %s", e)
        return "Não consegui consultar as peças plásticas agora."


def get_total_pecas_metalicas() -> str:
    try:
        return f"Total de peças metálicas produzidas: {_contar_por_peca(ID_PECA_METALICA)}."
    except requests.RequestException as e:
        logger.warning("Falha ao obter peças metálicas: %s", e)
        return "Não consegui consultar as peças metálicas agora."


def get_eficiencia() -> str:
    try:
        total = len(_get("producao"))
        refugos = len(_get("producao/refugos"))
    except requests.RequestException as e:
        logger.warning("Falha ao calcular eficiência: %s", e)
        return "Não consegui calcular a eficiência agora."
    if total == 0:
        return "Ainda não há produção registrada."
    corretas = total - refugos
    eficiencia = (corretas / total) * 100
    return f"Eficiência da produção: {eficiencia:.1f}% ({corretas} de {total} peças classificadas corretamente)."


def get_comparativo_materiais() -> str:
    try:
        data = _get("producao")
    except requests.RequestException as e:
        logger.warning("Falha ao comparar materiais: %s", e)
        return "Não consegui comparar os materiais agora."
    metal = sum(1 for p in data if p.get("idPeca") == ID_PECA_METALICA)
    plast = sum(1 for p in data if p.get("idPeca") == ID_PECA_PLASTICA)
    if metal == 0 and plast == 0:
        return "Ainda não há peças classificadas."
    if metal > plast:
        veredito = f"As metálicas lideram ({metal} vs {plast})."
    elif plast > metal:
        veredito = f"As plásticas lideram ({plast} vs {metal})."
    else:
        veredito = f"Empate técnico ({metal} de cada)."
    return f"Comparativo de materiais — metálicas: {metal}, plásticas: {plast}. {veredito}"


def get_resumo() -> str:
    try:
        producao = _get("producao")
        refugos = _get("producao/refugos")
    except requests.RequestException as e:
        logger.warning("Falha ao montar resumo: %s", e)
        return "Não consegui montar o resumo agora."
    total = len(producao)
    if total == 0:
        return "Ainda não há produção registrada."
    metal = sum(1 for p in producao if p.get("idPeca") == ID_PECA_METALICA)
    plast = sum(1 for p in producao if p.get("idPeca") == ID_PECA_PLASTICA)
    ref = len(refugos)
    taxa = (ref / total) * 100
    return (
        "📊 Resumo da produção:\n"
        f"• Total de peças: {total}\n"
        f"• Metálicas: {metal}\n"
        f"• Plásticas: {plast}\n"
        f"• Refugos: {ref}\n"
        f"• Taxa de refugo: {taxa:.1f}%\n"
        f"• Eficiência: {100 - taxa:.1f}%"
    )


def get_melhor_dia() -> str:
    try:
        data = _get("producao")
    except requests.RequestException as e:
        logger.warning("Falha ao buscar melhor dia: %s", e)
        return "Não consegui consultar a produção agora."
    if not data:
        return "Ainda não há produção registrada."
    contagem: Counter = Counter()
    for p in data:
        ts = p.get("timestampProducao")
        if not ts:
            continue
        try:
            dia = datetime.fromisoformat(ts).date()
        except ValueError:
            continue
        contagem[dia] += 1
    if not contagem:
        return "Não consegui determinar as datas de produção."
    dia, qtd = contagem.most_common(1)[0]
    return f"O dia com mais produção foi {dia.strftime('%d/%m/%Y')}, com {qtd} peças."


def get_info_pecas_por_tempo(mensagem: str) -> str:
    try:
        data = _get("producao")
    except requests.RequestException as e:
        logger.warning("Falha ao buscar dados de produção: %s", e)
        return "Não consegui consultar os dados de produção agora."

    if not data:
        return "Nenhuma peça foi produzida ainda."

    data.sort(key=lambda x: x.get("timestampProducao", ""), reverse=True)
    mensagem = mensagem.lower()

    # Última peça.
    if "última peça" in mensagem or "ultima peça" in mensagem:
        ts = data[0].get("timestampProducao", "—")
        return f"A última peça foi produzida em {ts}."

    # Últimas N peças.
    if "últimas" in mensagem or "ultimas" in mensagem:
        match = re.search(r"(\d+)", mensagem)
        if match:
            qtd = int(match.group(1))
            linhas = [f"{i+1}ª peça: {item.get('timestampProducao', '—')}" for i, item in enumerate(data[:qtd])]
            return "Datas das últimas peças:\n" + "\n".join(linhas)

    # Data específica (DD/MM/AAAA).
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
                dt_item = datetime.fromisoformat(timestamp).date()
            except ValueError:
                logger.debug("Timestamp em formato inesperado: %s", timestamp)
                continue
            if dt_item == dt_input:
                filtradas.append(item)

        if not filtradas:
            return f"Nenhuma peça foi produzida em {data_str}."
        linhas = [f"{i+1}ª peça: {item.get('timestampProducao', '—')}" for i, item in enumerate(filtradas)]
        return f"Peças produzidas em {data_str}:\n" + "\n".join(linhas)

    return ("Por favor, especifique se deseja a última peça, as últimas N peças "
            "ou uma data específica (ex: 25/05/2025).")
