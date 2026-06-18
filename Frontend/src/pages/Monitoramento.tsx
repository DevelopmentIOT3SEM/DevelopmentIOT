import { useEffect, useMemo, useState } from 'react';
import { getMonitoramentos, getSensores } from '@/services/api';
import type { Monitoramento as Mon, Sensor } from '@/services/types';
import { formatarDataHora } from '@/utils/datas';
import './Monitoramento.css';

const POLL_MS = 5000;

export function Monitoramento() {
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [monitoramentos, setMonitoramentos] = useState<Mon[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [carregouUmaVez, setCarregouUmaVez] = useState(false);

  useEffect(() => {
    let ativo = true;
    const controller = new AbortController();

    const carregar = async () => {
      try {
        const [s, m] = await Promise.all([getSensores(), getMonitoramentos()]);
        if (!ativo) return;
        setSensores(s);
        setMonitoramentos(m);
        setErro(null);
      } catch {
        if (ativo) setErro('Não foi possível atualizar o monitoramento.');
      } finally {
        if (ativo) setCarregouUmaVez(true);
      }
    };

    carregar();
    const id = setInterval(carregar, POLL_MS);
    return () => {
      ativo = false;
      controller.abort();
      clearInterval(id);
    };
  }, []);

  const estadoPorSensor = useMemo(() => {
    const mapa = new Map<number, Mon>();
    for (const m of monitoramentos) {
      const atual = mapa.get(m.idSensor);
      if (!atual || m.timestampMonitoramento > atual.timestampMonitoramento) {
        mapa.set(m.idSensor, m);
      }
    }
    return mapa;
  }, [monitoramentos]);

  return (
    <div className="monitoramento">
      <h1>Monitoramento</h1>
      <p className="muted">Estado atual dos sensores da esteira (atualiza a cada {POLL_MS / 1000}s).</p>

      {erro && <div className="alert-error">{erro}</div>}
      {!carregouUmaVez && <p className="muted">Carregando…</p>}

      <div className="sensores-grid">
        {sensores.map((sensor) => {
          const ultimo = estadoPorSensor.get(sensor.idSensor);
          const estado = ultimo?.estado?.toLowerCase().trim();
          const ligado = estado === 'on';
          return (
            <div className="card sensor" key={sensor.idSensor}>
              <div className="sensor-top">
                <span className="sensor-nome">{sensor.nome}</span>
                <span className={`badge ${ligado ? 'on' : estado === 'off' ? 'off' : 'unknown'}`}>
                  {ultimo ? (ligado ? 'Ligado' : 'Desligado') : 'Sem leitura'}
                </span>
              </div>
              {ultimo && (
                <span className="muted sensor-ts">
                  Última leitura: {formatarDataHora(ultimo.timestampMonitoramento)}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {carregouUmaVez && sensores.length === 0 && !erro && (
        <p className="muted">Nenhum sensor cadastrado.</p>
      )}
    </div>
  );
}
