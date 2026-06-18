# 🌱 EcoVida · Web (React + TypeScript + Vite)

Painel web do sistema de monitoramento da esteira de reciclagem. Consome
diretamente a **API .NET** (autenticação, produção, monitoramento) e o
**serviço de chatbot**.

> O site estático original (HTML/CSS/JS) foi preservado em [`legacy/`](./legacy)
> como referência histórica.

## Stack

- React 18 + TypeScript + Vite
- React Router (rotas + guarda de autenticação)
- Axios (cliente único com interceptor de token e tratamento de 401)
- Chart.js / react-chartjs-2 (gráficos)

## Páginas

- **Home** — landing institucional.
- **Login/Cadastro** — autenticação via API (JWT em `localStorage`).
- **Dashboard** — produção por destino (rampas/refugo), taxa de refugo e produção por dia.
- **Monitoramento** — estado dos sensores em tempo (polling de 5s).
- **Assistente** — chat conectado ao serviço de chatbot.

## Pré-requisitos

- Node 18+
- API .NET rodando (por padrão em `http://localhost:5271`) — veja `Backend/`.

## Rodando

```bash
cd Frontend
npm install
cp .env.example .env     # ajuste VITE_API_URL / VITE_CHATBOT_URL se necessário
npm run dev              # http://localhost:5173
```

Build de produção: `npm run build` (gera `dist/`). Pré-visualizar: `npm run preview`.

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5271` | Base da API .NET |
| `VITE_CHATBOT_URL` | `http://localhost:5000` | Serviço de chatbot |

> A API precisa permitir a origem do front no CORS (`Cors:Origins`), por padrão
> `http://localhost:5173`.
