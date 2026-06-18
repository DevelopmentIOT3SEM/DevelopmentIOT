from api_client import (
    get_status_sensores,
    get_volume_processado,
    get_total_operacoes,
    get_total_refugos,
    get_taxa_refugo,
    get_total_pecas_plasticas,
    get_total_pecas_metalicas,
    get_info_pecas_por_tempo
)

import logging

logger = logging.getLogger(__name__)


def chatbot(message: str) -> str:
    message = message.lower().strip()
    logger.info("Mensagem recebida: %s", message)

    # Taxa de refugo antes do "refugo" genérico.
    if "taxa" in message and "refugo" in message:
        return get_taxa_refugo()

    # Sensores / atuadores / esteira.
    elif "sensor" in message or "sensores" in message or "atuador" in message or "esteira" in message:
        return get_status_sensores()

    # Peças plásticas.
    elif "plástico" in message or "plastica" in message or "plásticas" in message:
        return get_total_pecas_plasticas()

    # Peças metálicas.
    elif "metal" in message or "metálica" in message or "metálicas" in message:
        return get_total_pecas_metalicas()

    # Volume processado.
    elif "volume" in message or "processado" in message:
        return get_volume_processado()

    # Total de produção.
    elif "produção" in message or "produzido" in message:
        return get_total_operacoes()

    # Refugos.
    elif "refugo" in message or "refugado" in message or "defeituoso" in message:
        return get_total_refugos()

    # Horário/data de produção (incl. "última peça", "últimas N peças").
    elif any(p in message for p in ("data", "horário", "horario", "quando",
                                     "última", "ultima", "últimas", "ultimas")):
        return get_info_pecas_por_tempo(message)

    else:
        return "Desculpe, não consegui entender."