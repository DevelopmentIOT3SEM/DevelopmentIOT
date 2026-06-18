// Tipos que espelham os DTOs da API .NET.

export interface Producao {
  idProducao: number;
  idPeca: number;
  rampa: number;
  timestampProducao: string;
}

export interface Sensor {
  idSensor: number;
  nome: string;
}

export interface Monitoramento {
  idMonitoramento: number;
  idSensor: number;
  estado: string;
  timestampMonitoramento: string;
}

export interface Usuario {
  nome: string;
  email: string;
}
