# 📋 Plano de Reativação — DevelopmentIOT

> Projeto Integrador (3º semestre) sendo profissionalizado para portfólio/LinkedIn.
> Diagnóstico e roadmap. Atualize os checkboxes conforme avançamos.

## 🎯 Objetivo

Pegar o projeto de faculdade (espalhado em várias branches, com pendências) e
deixá-lo **consolidado, funcionando ponta-a-ponta e apresentável**, mantendo a
narrativa de que foi um projeto muito bom da faculdade que passou por limpeza e
melhorias.

## 🧩 O que é o projeto

Sistema IoT de monitoramento para **indústria de reciclagem** — separação
automática de materiais metálicos × plásticos numa esteira com sensores e
atuadores. Os sensores (simulados via **Node-RED**) enviam dados via HTTP para a
API, que persiste em PostgreSQL. Web, Mobile e Chatbot consomem a API.

| Componente | Stack | Origem (branch) |
|---|---|---|
| Backend (API) | .NET 9, Dapper, PostgreSQL, JWT | develop / feature/mobile |
| Frontend Web | HTML/CSS/JS → **migrar p/ Vite** | develop |
| Mobile | React Native + Expo + TypeScript | feature/mobile |
| Chatbot | Python/Flask, endpoint `/chat` | develop |
| Data Science | Jupyter Notebook | feature/data-science |
| Banco + IoT | SQL + Docker (Postgres, pgAdmin, Node-RED) | develop |

## ✅ Checklist — o que já estava feito

- [x] Backend em camadas (Controllers → Services → Repositories → Dapper)
- [x] Entidades: Usuário, Peça, Sensor, Monitoramento, Produção
- [x] Auth JWT + BCrypt (login/registro)
- [x] Docker Compose (Postgres + pgAdmin + Node-RED + API)
- [x] Schema SQL com tabelas, FKs e seeds
- [x] Mobile com abas (dashboard, charts, chatbot) + telas de auth
- [x] Frontend web (login, dashboard, monitoramento, chatbot)
- [x] Chatbot Flask integrado
- [x] Notebook de análise de dados

## 🔴 Problemas identificados

1. Código espalhado em 3 branches, nada mergeado na `main`. ✅ **resolvido na consolidação**
2. Sem `.gitignore`; artefatos de build versionados (bin/obj/.vs/__pycache__/.db). ✅ **resolvido**
3. Segredos versionados (JWT secret + senha do banco em `appsettings.json`).
4. `Mobile/api.js` é script de teste com `localhost` chumbado.
5. Sem README raiz unificando os componentes; sem demo/prints.
6. `Chatbot/config.py` vazio.

## 🗺️ Roadmap

### Fase 1 — Consolidação ✅ CONCLUÍDA
- [x] Criar branch `chore/consolidacao`
- [x] Juntar Backend + Frontend + Mobile + Chatbot + Data_Science + SQL + ER
- [x] Adicionar `.gitignore` (.NET/Node/Python/Expo)
- [x] Remover artefatos de build do versionamento
- [ ] Validar e fazer merge na `main`

### Fase 2 — Segurança & configuração
- [ ] Tirar segredos do `appsettings.json` → variáveis de ambiente / `.env.example`
- [ ] Centralizar URL da API (mobile e web) por configuração
- [ ] Revisar CORS e validação de input (ver relatório do backend)

### Fase 3 — Funcionar ponta-a-ponta
- [ ] `docker-compose up` validando API + banco + Node-RED
- [ ] Testar mobile contra a API
- [ ] Testar web contra a API
- [ ] Validar chatbot

### Fase 4 — Vitrine (LinkedIn)
- [ ] **Migrar frontend HTML → Vite** (definir React / Vue / Vanilla+TS)
- [ ] README raiz: problema, arquitetura (diagrama), stack, como rodar, prints/GIFs
- [ ] Limpar notebook de DS e gerar gráficos de impacto
- [ ] Organizar `docs/` (mover PDF e diagrama ER)

## 🔎 Revisões técnicas (em `docs/`)

- [Backend](docs/REVISAO_BACKEND.md) — registro retorna 500, conexão inconsistente, segredos versionados, endpoints públicos, rampa errada.
- [Mobile](docs/REVISAO_MOBILE.md) — **3 bloqueadores de build** (import `prisma`, hook no topo, AuthProvider duplicado) + URLs hardcoded/HTTP.
- [Frontend](docs/REVISAO_FRONTEND.md) — 3 back-ends inconsistentes, linhas órfãs quebram `script.js`, XSS no chat, auth cosmética, **WeatherAPI key exposta**.
- [Chatbot](docs/REVISAO_CHATBOT.md) — `debug=True` (RCE), URL hardcoded, sem timeout. (Já **não** usa SQLite — consome a API .NET.)

## 🔁 Temas transversais (aparecem em quase todos)

1. **URLs de API hardcoded** em todo lugar (mobile, web, chatbot), às vezes inconsistentes entre si → centralizar por variável de ambiente.
2. **Token mal guardado** — `AsyncStorage` (mobile) e `localStorage` (web), sem checar expiração.
3. **Segredos no Git** — JWT + senha do banco (backend) e **WeatherAPI key** (front). Rotacionar e externalizar.
4. **Sem tratamento de erro / feedback** — vários `fetch`/`requests` engolem erro só com `console`.
5. **Código morto e resíduos de template** — `api.js`/`authService.js` (mobile), `Frontend/py`/`app copy.py`/imagens "- Copia" (web), `volume==operações` (chatbot).
6. **READMEs desatualizados/mínimos** em todos os módulos.

## 📝 Notas

- Branches antigas (`develop`, `feature/mobile`, `feature/data-science`)
  preservadas como histórico.
- Camada "IoT/hardware" no repositório é o **Node-RED** simulando a esteira/
  sensores (não há firmware ESP32/Arduino versionado).
