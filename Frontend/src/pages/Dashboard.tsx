import { useEffect, useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Layers, AlertOctagon, Package, Percent } from 'lucide-react';
import { getProducao, getRefugos } from '@/services/api';
import type { Producao } from '@/services/types';
import './Dashboard.css';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement,
  Title, Tooltip, Legend,
);

const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function Dashboard() {
  const [producao, setProducao] = useState<Producao[]>([]);
  const [refugos, setRefugos] = useState<Producao[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        setLoading(true);
        const [prod, refs] = await Promise.all([getProducao(), getRefugos()]);
        if (!ativo) return;
        setProducao(prod);
        setRefugos(refs);
        setErro(null);
      } catch {
        if (ativo) setErro('Não foi possível carregar os dados da produção.');
      } finally {
        if (ativo) setLoading(false);
      }
    })();
    return () => { ativo = false; };
  }, []);

  const stats = useMemo(() => {
    const rampa1 = producao.filter((p) => p.rampa === 1).length;
    const rampa2 = producao.filter((p) => p.rampa === 2).length;
    const totalRefugo = refugos.length;
    const totalValidas = rampa1 + rampa2;
    const totalGeral = totalValidas + totalRefugo;
    const taxaRefugo = totalGeral > 0 ? (totalRefugo / totalGeral) * 100 : 0;
    return { rampa1, rampa2, totalRefugo, totalValidas, totalGeral, taxaRefugo };
  }, [producao, refugos]);

  const porDiaSemana = useMemo(() => {
    const counts = Array(7).fill(0);
    producao.forEach((p) => {
      const dia = new Date(p.timestampProducao).getDay();
      counts[dia] += 1;
    });
    return counts;
  }, [producao]);

  if (loading) return <p className="muted">Carregando dados…</p>;
  if (erro) return <div className="alert-error">{erro}</div>;

  const cards = [
    { label: 'Rampa 1 (Metálica)', value: stats.rampa1, icon: Layers, color: 'var(--green-600)' },
    { label: 'Rampa 2 (Plástica)', value: stats.rampa2, icon: Layers, color: 'var(--blue-500)' },
    { label: 'Refugos', value: stats.totalRefugo, icon: AlertOctagon, color: 'var(--red-500)' },
    { label: 'Total produzido', value: stats.totalGeral, icon: Package, color: 'var(--slate-700)' },
    { label: 'Taxa de refugo', value: `${stats.taxaRefugo.toFixed(1)}%`, icon: Percent, color: 'var(--amber-500)' },
  ];

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p className="muted">Visão geral da produção da esteira.</p>

      <div className="stats-grid">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div className="card stat" key={label}>
            <Icon size={22} color={color} />
            <div>
              <div className="stat-value">{value}</div>
              <div className="stat-label muted">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {stats.totalGeral === 0 ? (
        <div className="card">
          <p className="muted">Ainda não há produção registrada. Os gráficos aparecem assim que houver dados.</p>
        </div>
      ) : (
        <div className="charts-grid">
          <div className="card">
            <h3>Produção por destino</h3>
            <Bar
              data={{
                labels: ['Rampa 1', 'Rampa 2', 'Refugo'],
                datasets: [{
                  label: 'Peças',
                  data: [stats.rampa1, stats.rampa2, stats.totalRefugo],
                  backgroundColor: ['#16a34a', '#3b82f6', '#ef4444'],
                  borderRadius: 6,
                }],
              }}
              options={{ responsive: true, plugins: { legend: { display: false } } }}
            />
          </div>

          <div className="card">
            <h3>Taxa de refugo</h3>
            <Doughnut
              data={{
                labels: ['Válidas', 'Refugo'],
                datasets: [{
                  data: [stats.totalValidas, stats.totalRefugo],
                  backgroundColor: ['#16a34a', '#ef4444'],
                }],
              }}
              options={{ responsive: true }}
            />
          </div>

          <div className="card wide">
            <h3>Produção por dia da semana</h3>
            <Line
              data={{
                labels: DIAS,
                datasets: [{
                  label: 'Peças produzidas',
                  data: porDiaSemana,
                  borderColor: '#16a34a',
                  backgroundColor: 'rgba(22, 163, 74, 0.2)',
                  fill: true,
                  tension: 0.3,
                }],
              }}
              options={{ responsive: true, scales: { y: { beginAtZero: true } } }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
