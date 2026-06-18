# 🏭 Simulador da Esteira

Como o projeto não tem o hardware físico em mãos, estes simuladores reproduzem o
comportamento do **ESP/esteira**: a cada peça, definem o estado dos sensores e
disparam o processamento na API .NET — exatamente o que o microcontrolador faria.

Há duas implementações equivalentes:

| | O que é | Quando usar |
|---|---|---|
| `simulador_esp.py` | Script Python que dispara direto na API | Popular dados rapidamente / rodar no terminal |
| `node-red-flow.json` | Fluxo no **Node-RED** (já incluso no docker-compose) | Demonstração visual contínua da "linha de produção" |

## Como a simulação funciona

Para cada peça:

1. Sorteia o material **esperado** (metálica ou plástica).
2. Simula a **leitura dos sensores**: na maioria das vezes detecta o material
   certo; numa fração (taxa de erro) detecta o material errado ou nada —
   gerando **refugo**.
3. `POST /api/Monitoramento` para o Atuador 1 (metal), Atuador 2 (plástico) e Esteira.
4. `POST /api/Processamento/processar-peca` com o material esperado. O backend
   compara o detectado com o esperado e decide a rampa (1 = metálica,
   2 = plástica, 3 = refugo).

## 1) Simulador Python

Pré-requisito: API .NET rodando (Docker ou local). Só usa a biblioteca padrão.

```bash
cd Simulador
python simulador_esp.py --quantidade 120 --intervalo 0.1
```

Parâmetros:

| Flag | Padrão | Descrição |
|---|---|---|
| `--api` | `http://localhost:5271` | URL base da API |
| `--quantidade` | `120` | Nº de peças a simular |
| `--intervalo` | `0.1` | Intervalo (s) entre peças (`0` = o mais rápido possível) |
| `--taxa-erro` | `0.12` | Fração de peças com leitura divergente → refugo |

## 2) Fluxo Node-RED (diferencial)

O `docker-compose` já sobe um Node-RED em http://localhost:1880.

**Importar pela interface:** menu (☰) → *Import* → cole o conteúdo de
`node-red-flow.json` → *Import* → *Deploy*. O fluxo passa a gerar uma peça a
cada 4 segundos (ajustável no nó *inject* "Nova peça").

**Importar pela linha de comando** (API de admin):

```bash
curl -X POST http://localhost:1880/flows \
  -H "Content-Type: application/json" \
  -H "Node-RED-Deployment-Type: full" \
  --data-binary @node-red-flow.json
```

> O fluxo aponta para `http://backend:8080` (nome do serviço na rede do Docker).
> Se rodar o Node-RED fora do Docker, troque a URL nos nós *function* para
> `http://localhost:5271`.
>
> Para **pausar**: desabilite a aba do fluxo ou o nó *inject* e faça *Deploy*.
