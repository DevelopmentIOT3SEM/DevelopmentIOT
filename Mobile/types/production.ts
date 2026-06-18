// Tipos compartilhados do domínio de produção (espelham os DTOs da API .NET).
export interface ProductionItem {
  idProducao: number;
  idPeca: number;
  rampa: number;
  timestampProducao: string;
}
