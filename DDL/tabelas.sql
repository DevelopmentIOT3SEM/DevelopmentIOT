CREATE TABLE Peca (
    id_peca SERIAL PRIMARY KEY,
    tipo_peca VARCHAR(100) NOT NULL
);

CREATE TABLE Monitoramento (
    id_monitoramento SERIAL PRIMARY KEY,
    id_peca INT NOT NULL,
    esteira_on_off BOOLEAN NOT NULL,
    atuador1_on_off BOOLEAN NOT NULL,
    atuador2_on_off BOOLEAN NOT NULL,
    qtde_r1 INT NOT NULL,
    qtde_r2 INT NOT NULL,
    qtde_descartada INT NOT NULL,
    data_hora_monitoramento TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    erros INT NOT NULL,
    CONSTRAINT fk_peca FOREIGN KEY(id_peca) REFERENCES Peca(id_peca)
);

CREATE TABLE Usuarios (
    Id SERIAL PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    SenhaHash VARCHAR(60) NOT NULL
);