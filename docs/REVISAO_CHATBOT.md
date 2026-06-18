# 🔎 Revisão do Chatbot (Python/Flask)

API Flask fina = interface de linguagem natural sobre a API .NET. Revisão de leitura.

## ⚠️ Achados que corrigem o PLANO
- **Não usa SQLite.** Apesar do README, o serviço consome a **API .NET** (`api_client.py:4`, `localhost:5271/api`) via `requests`. A remoção do `instance/dados_producao.db` **não afeta** nada. `config.py` e `db.py` **não existem** mais.
- Respostas por **regras/keyword matching** (`chatbot.py:12`), sem LLM. Endpoint único `POST /chat` (`app.py:8`).

## Bugs
- [ALTA] `debug=True` + `host='0.0.0.0'` fixos — `app.py:19`. Debugger Werkzeug = RCE. Ler de env; usar Gunicorn/Waitress.
- [ALTA] `API_BASE_URL` hardcoded `localhost:5271` — `api_client.py:4`. → `os.getenv`.
- [MÉDIA] Metade das funções sem tratamento de erro/`raise_for_status()` — `api_client.py:44-69`.
- [MÉDIA] **Nenhuma chamada `requests.get` tem `timeout`** — trava a thread do Flask se a API pendurar.
- [BAIXA] Validação de input ausente (`force=True`, sem checar `mensagem`) — `app.py:11-13`.
- [BAIXA] Keyword `"erro"` roteia p/ refugo indevidamente — `chatbot.py:41`.
- [BAIXA] Acesso `item['timestampProducao']` sem `.get()` — `api_client.py:106,115,144`.
- [MÉDIA] README desatualizado (diz que consulta "o banco"/"último registro").

## Segurança
- [ALTA] `debug=True` em produção (RCE via console Werkzeug).
- [MÉDIA] `CORS(app)` aberto p/ qualquer origem — `app.py:6`.
- [MÉDIA] Vaza `str(e)` ao cliente (URLs/exceções) — `app.py:16` e funções de `api_client`.
- [MÉDIA] Sem limite de tamanho de input.
- ✅ Sem SQL injection (não fala com banco direto), sem segredos hardcoded.

## Qualidade
Estrutura legível e bem separada (app/chatbot/api_client). Mas: tratamento de erro inconsistente; `requirements.txt` sem versões fixadas e sem WSGI de produção; `print` de debug (`chatbot.py:14`); `import re` dentro de função (`api_client.py:110,119`); `get_volume_processado` e `get_total_operacoes` são **idênticas**; sem testes.

## Falta p/ "pronto"
Config por env (`.env` + `python-dotenv`, `.env.example`); README de execução real com exemplo `curl`; tratar API offline (timeout + mensagem amigável + health check); logging no lugar de `print`; pin de versões; `Dockerfile` + integração ao `docker-compose` (apontar `API_BASE_URL` pro nome de rede do serviço); testes do roteador com `requests` mockado.
