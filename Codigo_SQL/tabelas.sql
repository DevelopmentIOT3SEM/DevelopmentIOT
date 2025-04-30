CREATE TABLE Usuarios (
    Id SERIAL PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    SenhaHash VARCHAR(255) NOT NULL
);
-- Tabela Peça (DML - Fixa)
CREATE TABLE Peca (
    id_peca SERIAL PRIMARY KEY,
    tipo_material VARCHAR(50) NOT NULL
);

-- Tabela Sensor (DML - Fixa)
CREATE TABLE Sensor (
    id_sensor SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

-- Tabela Monitoramento (CR - Dinâmica)
CREATE TABLE Monitoramento (
    id_monitoramento SERIAL PRIMARY KEY,
    id_sensor INT REFERENCES Sensor(id_sensor),
    estado VARCHAR(10) NOT NULL CHECK (estado IN ('on', 'off')),
    timestamp_monitoramento TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela Produção (CR - Dinâmica)
CREATE TABLE Producao (
    id_producao SERIAL PRIMARY KEY,
    id_peca INT REFERENCES Peca(id_peca) NOT NULL, -- Agora obrigatório
    rampa INT NOT NULL,
    timestamp_producao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Inserindo em Peça (DML)
INSERT INTO Peca (id_peca, tipo_material) VALUES 
(1, 'Metálica'),
(2, 'Plástica'),
(3, 'Refugo'); -- Adicionando o tipo Refugo

-- Inserindo em Sensor (DML)
INSERT INTO Sensor (id_sensor, nome) VALUES 
(1, 'Atuador 1'),
(2, 'Atuador 2'),
(3, 'Esteira');