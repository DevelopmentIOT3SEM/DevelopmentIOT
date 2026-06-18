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

export interface Estatisticas {
  total: number;
  totalMetalica: number;
  totalPlastica: number;
  totalRefugo: number;
  taxaRefugo: number;
  eficiencia: number;
  porTurno: { turno: string; total: number; eficiencia: number }[];
  porDia: { data: string; total: number }[];
  erros: { plasticoComoMetal: number; metalComoPlastico: number; naoIdentificado: number };
}
