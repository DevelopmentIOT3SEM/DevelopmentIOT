CREATE TABLE Usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE Peca (
    id_peca SERIAL PRIMARY KEY,
    tipo_material VARCHAR(50) NOT NULL
);


CREATE TABLE Sensor (
    id_sensor SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE Monitoramento (
    id_monitoramento SERIAL PRIMARY KEY,
    id_sensor INT REFERENCES Sensor(id_sensor),
    estado VARCHAR(10) NOT NULL CHECK (estado IN ('on', 'off')),
    timestamp_monitoramento TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Producao (
    id_producao SERIAL PRIMARY KEY,
    id_peca INT REFERENCES Peca(id_peca) NOT NULL, 
    rampa INT NOT NULL,
    timestamp_producao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Peca (id_peca, tipo_material) VALUES 
(1, 'Metálica'),
(2, 'Plástica'),
(3, 'Refugo'); 

INSERT INTO Sensor (id_sensor, nome) VALUES 
(1, 'Atuador 1'),
(2, 'Atuador 2'),
(3, 'Esteira');

-- Queries
SELECT 
    p.id_producao,
    pc.tipo_material,
    p.rampa,
    p.timestamp_producao
FROM 
    Producao p
JOIN 
    Peca pc ON p.id_peca = pc.id_peca;

SELECT 
    s.nome,
    COUNT(m.id_monitoramento) AS total_monitoramentos
FROM 
    Sensor s
LEFT JOIN 
    Monitoramento m ON s.id_sensor = m.id_sensor
GROUP BY 
    s.nome;


SELECT 
    s.nome,
    m.estado,
    m.timestamp_monitoramento
FROM 
    Sensor s
JOIN 
    Monitoramento m ON s.id_sensor = m.id_sensor
WHERE 
    m.timestamp_monitoramento = (
        SELECT MAX(m2.timestamp_monitoramento)
        FROM Monitoramento m2
        WHERE m2.id_sensor = s.id_sensor
    );

SELECT 
    pr.id_producao,
    pc.tipo_material,
    pr.timestamp_producao,
    s.nome AS sensor,
    m.estado,
    m.timestamp_monitoramento
FROM 
    Producao pr
JOIN 
    Peca pc ON pr.id_peca = pc.id_peca
JOIN 
    Monitoramento m ON DATE(pr.timestamp_producao) = DATE(m.timestamp_monitoramento)
JOIN 
    Sensor s ON m.id_sensor = s.id_sensor
ORDER BY 
    pr.timestamp_producao;

SELECT 
    pc.tipo_material,
    COUNT(p.id_producao) AS total_produzido
FROM 
    Producao p
JOIN 
    Peca pc ON p.id_peca = pc.id_peca
GROUP BY 
    pc.tipo_material;

