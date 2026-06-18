# 🤖 Chatbot de Produção (Flask)

Serviço HTTP que responde, em linguagem natural, perguntas sobre a produção da
esteira de reciclagem. Funciona como uma camada fina sobre a **API .NET**: as
respostas (volume, refugos, taxa de refugo, status dos sensores, datas) são
montadas a partir dos endpoints de produção/monitoramento — não há banco próprio.

## Como funciona

- Endpoint único: `POST /chat` recebe `{ "mensagem": "..." }` e devolve `{ "resposta": "..." }`.
- Health check: `GET /health`.
- O roteamento é por palavras-chave (`chatbot.py`); a integração com a API fica em `api_client.py`.

## Pré-requisitos

- Python 3.11+
- A **API .NET rodando** (por padrão em `http://localhost:5271`). Veja `Backend/`.

## Rodando localmente

```bash
cd Chatbot
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env          # ajuste API_BASE_URL se necessário
python app.py                 # servidor de desenvolvimento (porta 5000)
```

Em produção, use o Gunicorn (já incluso no requirements):

```bash
gunicorn -b 0.0.0.0:5000 app:app
```

## Exemplo

```bash
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{"mensagem": "qual a taxa de refugo?"}'
# -> {"resposta": "Taxa de refugo: 50.00%"}
```

Perguntas reconhecidas: taxa de refugo, status dos sensores, peças plásticas/metálicas,
volume processado, total de produção, refugos, e datas (última peça, últimas N, DD/MM/AAAA).

## Configuração (variáveis de ambiente)

| Variável | Padrão | Descrição |
|---|---|---|
| `API_BASE_URL` | `http://localhost:5271/api` | Base da API .NET |
| `REQUEST_TIMEOUT` | `5` | Timeout (s) das chamadas à API |
| `HOST` / `PORT` | `0.0.0.0` / `5000` | Bind do servidor |
| `FLASK_DEBUG` | `0` | `1` ativa debug (apenas dev) |
| `CORS_ORIGINS` | `*` | Origens permitidas no CORS |
