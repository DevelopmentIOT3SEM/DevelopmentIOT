import logging
import unicodedata

from api_client import (
    get_comparativo_materiais,
    get_eficiencia,
    get_info_pecas_por_tempo,
    get_melhor_dia,
    get_resumo,
    get_status_sensores,
    get_taxa_refugo,
    get_total_operacoes,
    get_total_pecas_metalicas,
    get_total_pecas_plasticas,
    get_total_refugos,
    get_volume_processado,
)

logger = logging.getLogger(__name__)

AJUDA = (
    "Posso te ajudar com:\n"
    "• Resumo geral da produção\n"
    "• Taxa de refugo e eficiência\n"
    "• Status dos sensores da esteira\n"
    "• Contagem de peças (metálicas, plásticas, refugos)\n"
    "• Volume / total de produção\n"
    "• Comparativo entre materiais e melhor dia\n"
    "• Datas (última peça, últimas N peças, por data DD/MM/AAAA)\n\n"
    'Ex.: "resumo", "qual a taxa de refugo?", "compare os materiais".'
)


def _normalizar(texto: str) -> str:
    """Minúsculas, sem espaços nas pontas e sem acentos (para casar variações)."""
    texto = texto.lower().strip()
    nfkd = unicodedata.normalize("NFKD", texto)
    return "".join(c for c in nfkd if not unicodedata.combining(c))


def _contem(msg: str, *termos: str) -> bool:
    return any(t in msg for t in termos)


def chatbot(message: str) -> str:
    original = message
    msg = _normalizar(message)
    logger.info("Mensagem recebida: %s", msg)

    if not msg:
        return "Pode escrever sua pergunta? Digite 'ajuda' para ver o que eu sei responder."

    # Ajuda.
    if msg in ("/ajuda", "ajuda", "help", "?", "menu") or _contem(msg, "o que voce", "pode fazer", "como funciona"):
        return AJUDA

    # Saudações.
    if _contem(msg, "bom dia", "boa tarde", "boa noite") or msg in ("oi", "ola", "eai", "e ai", "opa"):
        return ("Olá! 👋 Sou o assistente da produção. Pergunte sobre refugos, sensores, "
                "peças, eficiência ou peça um resumo. Digite 'ajuda' para ver tudo.")

    # Agradecimentos.
    if _contem(msg, "obrigado", "obrigada", "valeu", "vlw", "agradec"):
        return "Por nada! 😊 Precisando, é só perguntar."

    # Resumo geral.
    if _contem(msg, "resumo", "visao geral", "panorama", "como esta a producao"):
        return get_resumo()

    # Taxa de refugo (antes do "refugo" genérico).
    if "taxa" in msg and "refugo" in msg:
        return get_taxa_refugo()

    # Eficiência.
    if _contem(msg, "eficiencia", "eficiente", "desempenho"):
        return get_eficiencia()

    # Comparativo de materiais.
    if _contem(msg, "compar", "versus", " vs ") or ("metal" in msg and "plastic" in msg):
        return get_comparativo_materiais()

    # Melhor dia.
    if _contem(msg, "melhor dia", "dia que mais", "dia com mais", "pico"):
        return get_melhor_dia()

    # Sensores / atuadores / esteira.
    if _contem(msg, "sensor", "atuador", "esteira"):
        return get_status_sensores()

    # Peças plásticas / metálicas.
    if "plastic" in msg:
        return get_total_pecas_plasticas()
    if "metal" in msg:
        return get_total_pecas_metalicas()

    # Volume processado.
    if _contem(msg, "volume", "processad"):
        return get_volume_processado()

    # Total de produção.
    if _contem(msg, "producao", "produzid", "quantas pecas", "total de pecas"):
        return get_total_operacoes()

    # Refugos.
    if _contem(msg, "refugo", "refugad", "defeit", "descarte"):
        return get_total_refugos()

    # Datas / histórico (usa o texto original para preservar a data digitada).
    if _contem(msg, "data", "horario", "quando", "ultima", "ultimas"):
        return get_info_pecas_por_tempo(original)

    # Fallback com direcionamento.
    return ("Não entendi muito bem 🤔. Posso responder sobre taxa de refugo, sensores, "
            "contagem de peças, eficiência, comparativos e datas. "
            "Digite 'ajuda' para ver exemplos.")
