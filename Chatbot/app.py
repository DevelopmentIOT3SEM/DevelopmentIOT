import logging

from flask import Flask, request, jsonify
from flask_cors import CORS

from chatbot import chatbot
from config import CORS_ORIGINS, FLASK_DEBUG, HOST, PORT

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, origins=CORS_ORIGINS)

# Limite de tamanho da mensagem aceita.
MAX_MENSAGEM_LEN = 1000


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/chat", methods=["POST"])
def chat():
    dados = request.get_json(silent=True) or {}
    mensagem = (dados.get("mensagem") or dados.get("message") or "").strip()

    if not mensagem:
        return jsonify({"erro": "Campo 'mensagem' é obrigatório."}), 400
    if len(mensagem) > MAX_MENSAGEM_LEN:
        return jsonify({"erro": "Mensagem muito longa."}), 400

    try:
        resposta = chatbot(mensagem)
        return jsonify({"resposta": resposta})
    except Exception:
        # Loga o detalhe internamente; não vaza stack/exceção ao cliente.
        logger.exception("Erro ao processar a mensagem")
        return jsonify({"erro": "Erro interno ao processar a mensagem."}), 500


if __name__ == "__main__":
    app.run(debug=FLASK_DEBUG, host=HOST, port=PORT)
