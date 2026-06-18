// A API .NET envia timestamps em UTC, porém sem o indicador de fuso ("Z").
// Sem isso, o JavaScript interpreta a string como horário local e exibe o
// horário UTC cru (adiantado). Aqui garantimos que seja lido como UTC.

function comoUtc(iso: string): Date {
  const temFuso = /[zZ]$|[+-]\d{2}:?\d{2}$/.test(iso);
  return new Date(temFuso ? iso : `${iso}Z`);
}

/** Data/hora formatada no fuso local do navegador (pt-BR). */
export function formatarDataHora(iso: string): string {
  return comoUtc(iso).toLocaleString('pt-BR');
}

/** Date no fuso local, para agrupamentos (dia da semana, etc.). */
export function paraDataLocal(iso: string): Date {
  return comoUtc(iso);
}
