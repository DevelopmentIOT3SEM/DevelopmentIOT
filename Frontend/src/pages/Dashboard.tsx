import { useEffect, useState } from 'react';
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
import { Layers, AlertOctagon, Package, Percent, Gauge } from 'lucide-react';
import { getEstatisticas } from '@/services/api';
import type { Estatisticas } from '@/services/types';
import './Dashboard.css';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement,
  Title, Tooltip, Legend,
);

const baseOptions = { responsive: true, maintainAspectRatio: false };

export function Dashboard() {
  const [stats, setStats] = useState<Estatisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getEstatisticas();
        if (!ativo) return;
        setStats(data);
        setErro(null);
      } catch {
        if (ativo) setErro('Não foi possível carregar as estatísticas.');
      } finally {
        if (ativo) setLoading(false);
      }
    })();
    return () => { ativo = false; };
  }, []);

  if (loading) return <p className="muted">Carregando dados…</p>;
  if (erro) return <div className="alert-error">{erro}</div>;
  if (!stats) return null;

  const validas = stats.total - stats.totalRefugo;

  const cards = [
    { label: 'Metálicas', value: stats.totalMetalica, icon: Layers, color: 'var(--green-600)' },
    { label: 'Plásticas', value: stats.totalPlastica, icon: Layers, color: 'var(--blue-500)' },
    { label: 'Refugos', value: stats.totalRefugo, icon: AlertOctagon, color: 'var(--red-500)' },
    { label: 'Total produzido', value: stats.total, icon: Package, color: 'var(--slate-700)' },
    { label: 'Eficiência', value: `${stats.eficiencia.toFixed(1)}%`, icon: Gauge, color: 'var(--green-600)' },
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

      {stats.total === 0 ? (
        <div className="card">
          <p className="muted">Ainda não há produção registrada. Os gráficos aparecem assim que houver dados.</p>
        </div>
      ) : (
        <div className="charts-grid">
          <div className="card">
            <h3>Produção por destino</h3>
            <div className="chart-box">
              <Bar
                data={{
                  labels: ['Rampa 1 (Metálica)', 'Rampa 2 (Plástica)', 'Refugo'],
                  datasets: [{
                    label: 'Peças',
                    data: [stats.totalMetalica, stats.totalPlastica, stats.totalRefugo],
                    backgroundColor: ['#16a34a', '#3b82f6', '#ef4444'],
                    borderRadius: 6,
                  }],
                }}
                options={{ ...baseOptions, plugins: { legend: { display: false } } }}
              />
            </div>
          </div>

          <div className="card">
            <h3>Eficiência da separação</h3>
            <div className="chart-box">
              <Doughnut
                data={{
                  labels: ['Corretas', 'Refugo'],
                  datasets: [{ data: [validas, stats.totalRefugo], backgroundColor: ['#16a34a', '#ef4444'] }],
                }}
                options={baseOptions}
              />
            </div>
          </div>

          <div className="card">
            <h3>Eficiência por turno</h3>
            <div className="chart-box">
              <Bar
                data={{
                  labels: stats.porTurno.map((t) => t.turno),
                  datasets: [{
                    label: 'Eficiência (%)',
                    data: stats.porTurno.map((t) => t.eficiencia),
                    backgroundColor: '#16a34a',
                    borderRadius: 6,
                  }],
                }}
                options={{ ...baseOptions, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }}
              />
            </div>
          </div>

          <div className="card">
            <h3>Erros de classificação</h3>
            <div className="chart-box">
              <Bar
                data={{
                  labels: ['Plástico como metal', 'Metal como plástico', 'Não identificado'],
                  datasets: [{
                    label: 'Ocorrências',
                    data: [stats.erros.plasticoComoMetal, stats.erros.metalComoPlastico, stats.erros.naoIdentificado],
                    backgroundColor: ['#3b82f6', '#f59e0b', '#94a3b8'],
                    borderRadius: 6,
                  }],
                }}
                options={{ ...baseOptions, plugins: { legend: { display: false } } }}
              />
            </div>
          </div>

          <div className="card wide">
            <h3>Produção por dia</h3>
            <div className="chart-box tall">
              <Line
                data={{
                  labels: stats.porDia.map((d) => d.data),
                  datasets: [{
                    label: 'Peças produzidas',
                    data: stats.porDia.map((d) => d.total),
                    borderColor: '#16a34a',
                    backgroundColor: 'rgba(22, 163, 74, 0.2)',
                    fill: true,
                    tension: 0.3,
                  }],
                }}
                options={{ ...baseOptions, scales: { y: { beginAtZero: true } } }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
