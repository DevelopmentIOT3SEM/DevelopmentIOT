from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot import chatbot

app = Flask(__name__)
CORS(app)

@app.route('/chat', methods=['POST'])
def chat():
    try:
        dados = request.get_json(force=True)
        mensagem = dados.get('mensagem') or dados.get('message', '')
        resposta = chatbot(mensagem)
        return jsonify({'resposta': resposta})
    except Exception as e:
        return jsonify({'erro': f'Erro ao processar a mensagem: {str(e)}'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)