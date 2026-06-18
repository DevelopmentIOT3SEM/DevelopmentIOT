# 🔎 Revisão do Frontend Web (HTML/CSS/JS → migrar p/ Vite)

Front "EcoVida": Home institucional (Bootstrap CDN), login/cadastro, dashboard (Chart.js+Plotly), monitoramento (polling), chatbot ("EcoBot"). Revisão de leitura.

## ⚠️ Achado importante
O front fala com **3 back-ends distintos e inconsistentes**, todos hardcoded:
- .NET Auth — cadastro em `52.44.49.80:5271`, **login em `localhost:5271`** (hosts diferentes!).
- Flask intermediário (`Home/app copy.py`) agrega dados da API .NET e expõe `/api/dados` em `localhost:5500`.
- Chatbot em `127.0.0.1:5000/chat`.

Autenticação é **cosmética**: nenhuma chamada envia o token, e não há guarda de rota — qualquer um abre `dashboard.html` direto.

## Bugs
- [ALTA] Hosts divergentes login×cadastro — `cadastro.js:35` vs `:75`.
- [ALTA] URLs hardcoded espalhadas (IP público fixo) — vários arquivos. → `import.meta.env.VITE_API_URL`.
- [ALTA] Polling de 500ms sem cancelamento/backoff — `monitoramento.js:55`. Subir p/ 5–10s, `AbortController`, idealmente SSE/WebSocket.
- [ALTA] **Linhas órfãs no fim do `script.js:329-330`** (`chat`/`input` undefined) → ReferenceError ao carregar dashboard/monitoramento/chatbot. Remover.
- [MÉDIA] `fetch` sem checar `res.ok` — `chatbot.js:54`.
- [MÉDIA] `carregarDados()` sem timeout e sem feedback de erro — `script.js:1-98`.
- [MÉDIA] `toggleForm()` chamado no HTML **não existe** no JS — `loginCadastro.html:29,49`.
- [MÉDIA] `monitoramento.html` carrega `script.js` que tenta canvases inexistentes — erros no console.
- [BAIXA] `Math.max(...[])` → `-Infinity`; código morto em `script.js:43`.
- [BAIXA] IDs HTML duplicados; `console.log` com senha (`cadastro.js:32`).

## Arquivos órfãos / duplicação
`Frontend/py` (vazio), `Frontend/logoo.png` (duplicado 3×), `app copy.py` (back-end dentro do front), imagens "- Copia", README cita `cadastro.html` inexistente, portas Flask inconsistentes (5000/5500/5001).

## Segurança
- [ALTA] **XSS** — histórico do chat persistido e reinjetado via `innerHTML` — `chatbot.js:8,70`. Persistir JSON estruturado + `textContent`.
- [ALTA] XSS na resposta do servidor via `innerHTML` — `script.js:329`.
- [ALTA] JWT em `localStorage` — `cadastro.js:90`. Preferir cookie HttpOnly/Secure.
- [ALTA] Sem guarda de rota; nenhuma request manda `Authorization`.
- [MÉDIA] `CORS(origins="*")` no Flask — `app copy.py:9`.
- [MÉDIA] **API key da WeatherAPI hardcoded** — `app copy.py:37`. **Revogar a chave exposta** e mover p/ env.

## Qualidade
Sem build/package.json (deps por CDN); navbar/sidebar duplicada em 3 páginas; `script.js` monolito; CSS morto e conflitante (`monitoramento` inline × css); acessibilidade fraca (`alt` vazio, ícones sem aria-label, `<img onclick>` de envio); `lang="en"` em páginas PT-BR.

## Migração p/ Vite — recomendação
**React + TypeScript + Vite.** Justificativa: já existe app Mobile em **React Native** (coerência de stack/equipe), TS elimina classes inteiras desses bugs e tipa os payloads da API, e React tem maior peso de portfólio/mercado que Vue.

**Aproveitar:** lógica de gráficos (`script.js:100-304`), design da Home e do card login/cadastro, lógica de polling (corrigida).
**Descartar:** `Frontend/py`, imagens "- Copia", `app copy.py` do front (migrar agregação p/ a API .NET; se sobreviver, vira microserviço separado com key em env), CSS morto, URLs hardcoded.

**Estrutura sugerida:** `src/{routes, components, services/api.ts (cliente único + interceptor), hooks/useMonitoramento}` + `.env (VITE_API_URL)`.
**Libs:** `react-chartjs-2`, `react-plotly.js` (ou Recharts), `react-router` c/ guarda de auth, `@tanstack/react-query` p/ o polling.
