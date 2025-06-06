# EcoVida - Frontend

Bem-vindo ao repositório da branch do frontend do projeto **EcoVida**, uma aplicação web para monitoramento em tempo real de peças em um Controlador Lógico Programável (CLP), classificando-as como metálicas, plásticas ou refugo.

## Tecnologias Utilizadas

- **HTML**: Estrutura das páginas web.
- **CSS**: Estilização da interface.
- **JavaScript**: Lógica do frontend, com bibliotecas:
  - [Chart.js](https://www.chartjs.org/) - Para visualização de gráficos.
  - [Plotly.js](https://plotly.com/javascript/) - Para tabelas e gráficos interativos.
- **Python com Flask**: Backend leve para comunicação com a API ASP .NET e tratamento de dados.
- **Bibliotecas Python**:
  - `flask` e `flask-cors`: Para criar o servidor e gerenciar requisições CORS.
  - `requests`: Para chamadas à API ASP .NET.
  - `numpy` e `pandas`: Para manipulação de dados.
  - `datetime`: Para lidar com timestamps.

## Estrutura do Projeto

```
FRONTEND/
├── .vscode/
│   └── settings.json
├── Home/
│   ├── Images/
│   ├── app copy.py           # Arquivo principal do Flask
│   ├── cadastro.css
│   ├── cadastro.js
│   ├── cadastro.html
│   ├── chatbot.css
│   ├── chatbot.js
│   ├── chatbot.html
│   ├── dashboard.css
│   ├── dashboard.html
│   ├── loginCadastro.html
│   ├── monitoramento.css
│   ├── monitoramento.js
│   ├── monitoramento.html
│   ├── script.js
├── Principal/
│   ├── .vscode/
│   ├── imagens/
│   ├── home.css
│   ├── home.html
│   └── logo.png
```

## Funcionalidades

O frontend exibe tabelas e gráficos interativos para monitoramento em tempo real das peças processadas pelo CLP, com base nos dados classificados (metálicas, plásticas ou refugo). A interface consome dados tratados pelo Flask, que atua como intermediário entre a API ASP .NET e o frontend.

### Fluxo de Dados
1. A **API ASP .NET** (em `http://localhost:5271/api`) fornece dados brutos do CLP.
2. O **Flask** faz requisições a todos os endpoints da API, tratando os dados com `pandas` e `numpy`.
3. O **JavaScript** consome os dados tratados do Flask, gerando tabelas e gráficos com **Chart.js** e **Plotly.js**.

## Pré-requisitos

- **Python 3.8+** instalado.
- **Node.js** (opcional, caso precise instalar dependências adicionais para o frontend).
- Extensão **Live Server** (para Visual Studio Code) ou equivalente para rodar o frontend localmente.
- API ASP .NET rodando em `http://localhost:5271/api`.

## Configuração do Ambiente

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/DevelopmentIOT3SEM/DevelopmentIOT.git
   cd FRONTEND
   ```

2. **Crie um ambiente virtual** (recomendado):
   ```bash
   python -m venv venv
   source venv/bin/activate
   venv\Scripts\activate
   ```

3. **Instale as dependências**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Inicie o servidor Flask**:
   ```bash
   python "Home/app copy.py"
   ```

5. **Acesse o frontend**:
   - Abra o Visual Studio Code, vá até as pastas `Home/` ou `Principal/` (ex.: `home.html` ou `dashboard.html`), e use a extensão **Live Server** (geralmente em `http://localhost:5500`).
   - Certifique-se de que o Flask está rodando (padrão: `http://localhost:5000`) para fornecer os dados.

## Integração com a API

O Flask consome todos os endpoints da API ASP .NET localizada em `http://localhost:5271/api`. Os dados são processados (usando `pandas` e `numpy`) e enviados ao frontend via rotas Flask. O JavaScript faz requisições às rotas do Flask para atualizar as tabelas e gráficos em tempo real.

## Scripts e Bibliotecas Externas

O frontend utiliza as seguintes bibliotecas externas, carregadas via CDN:
- **Chart.js**: `<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>`
- **Plotly.js**: `<script src="https://cdn.plot.ly/plotly-latest.min.js" defer></script>`

Os scripts JavaScript locais estão em `Home/` (ex.: `script.js`, `monitoramento.js`), e os estilos em `Home/` ou `Principal/` (ex.: `home.css`, `monitoramento.css`).

## Executando Localmente

1. Certifique-se de que a API ASP .NET está rodando em `http://localhost:5271/api`.
2. Inicie o Flask com:
   ```bash
   python "Home/app copy.py"
   ```
3. Use o **Live Server** para abrir os arquivos HTML em `Home/` ou `Principal/` (ex.: `http://localhost:5500`).

## Observações

- **CORS**: O Flask usa `flask-cors` para permitir requisições entre o frontend e o backend.
- **Páginas**: Principais páginas incluem `home.html`, `dashboard.html`, `monitoramento.html`, `cadastro.html`, `chatbot.html` e `loginCadastro.html`.
