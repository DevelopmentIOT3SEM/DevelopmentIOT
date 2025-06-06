# README da Branch de Banco de Dados - EcoVida

## Visão Geral
Esta branch contém a configuração do banco de dados do projeto **EcoVida**, desenvolvido para monitorar peças que entram em um Controlador Lógico Programável (CLP), classificando-as como metálicas, plásticas ou refugo. O banco de dados utiliza **PostgreSQL**, gerenciado via **Docker**, e inclui scripts de Definição de Dados (DDL), scripts de Manipulação de Dados (DML) e um Diagrama Entidade-Relacionamento (DER) em formato de imagem.

## Tecnologias Utilizadas
- **PostgreSQL**: Sistema de gerenciamento de banco de dados relacional.
- **Docker**: Plataforma de conteinerização para executar o banco de dados PostgreSQL.
- **Scripts DML/DDL**: Scripts SQL para definir a estrutura do banco e inserir dados iniciais.
- **DER**: Diagrama Entidade-Relacionamento (em formato de imagem) representando o esquema do banco.

## Estrutura do Projeto
- Script de Definição de Dados (DDL) para criação de tabelas e esquemas.
- Script de Manipulação de Dados (DML) para inserção de dados iniciais.
- Diagrama Entidade-Relacionamento (imagem) do esquema do banco.

## Pré-requisitos
- **Docker**: Certifique-se de que o Docker e o Docker Compose estão instalados e em execução.
- **pgAdmin**: Ferramenta baseada na web para interação com o banco de dados PostgreSQL.
- Um navegador web para acessar a interface do pgAdmin.

## Instruções de Configuração
1. **Clonar o Repositório**:
   ```bash
   git clone https://github.com/DevelopmentIOT3SEM/DevelopmentIOT.git
   ```

2. **Iniciar o Contêiner PostgreSQL**:
   - Vá para a pasta do Backend
     ```bash
     cd Backend
     ```
    
   - Execute o comando abaixo para iniciar o banco de dados usando o Docker Compose:
     ```bash
     docker-compose up -d
     ```

3. **Acessar o pgAdmin**:
   - Abra seu navegador e acesse:
     ```
     http://localhost:5052
     ```
   - Faça login com as seguintes credenciais:
     - **E-mail**: `admin@admin.com`
     - **Senha**: `admin`

4. **Conectar ao Banco de Dados no pgAdmin**:
   - Crie uma nova conexão de servidor com os seguintes detalhes:
     - **Host**: `host.docker.internal` (Windows) ou `localhost` (Linux)
     - **Porta**: `5433`
     - **Usuário**: `admin`
     - **Senha**: `admin`
     - **Banco de Dados**: `pecasdb`

5. **Aplicar Scripts DDL e DML**:
   - No pgAdmin, abra a ferramenta de consulta (Query Tool) e execute o script DDL e DML dentro da pasta Codigo_SQL para criar a estrutura do banco:
     ```sql
     \i tabelas.sql
     ```

6. **Visualizar o DER**:
   - O Diagrama Entidade-Relacionamento está localizado em `DiagramaER`. Abra esta imagem para visualizar o esquema do banco.


## Observações
- Certifique-se de que o contêiner Docker está em execução antes de acessar o pgAdmin ou executar scripts SQL.
- O DER fornece uma representação visual do esquema do banco e deve ser consultado para entender as relações entre as tabelas.
