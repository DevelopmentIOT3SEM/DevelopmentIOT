import { Link } from 'react-router-dom';
import { Recycle, Cpu, BarChart3, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import './Home.css';

const destaques = [
  { icon: Cpu, titulo: 'Automação', texto: 'Sensores e atuadores classificam metal × plástico na esteira em tempo real.' },
  { icon: BarChart3, titulo: 'Dados', texto: 'Monitoramento da produção, refugos e eficiência num painel único.' },
  { icon: Recycle, titulo: 'Sustentabilidade', texto: 'Menos desperdício e mais qualidade no material reciclado.' },
];

export function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      <header className="home-header">
        <div className="brand">
          <Recycle size={26} color="var(--green-600)" />
          <span>EcoVida</span>
        </div>
        <Link to={isAuthenticated ? '/dashboard' : '/login'} className="btn btn-primary">
          {isAuthenticated ? 'Abrir painel' : 'Entrar'}
          <ArrowRight size={18} />
        </Link>
      </header>

      <section className="hero">
        <h1>Monitoramento inteligente para a indústria de reciclagem</h1>
        <p className="muted">
          Uma solução integrada que automatiza a separação de materiais metálicos e plásticos,
          estrutura os dados da produção e dá visibilidade da eficiência operacional.
        </p>
        <Link to={isAuthenticated ? '/dashboard' : '/login'} className="btn btn-primary">
          Começar <ArrowRight size={18} />
        </Link>
      </section>

      <section className="features">
        {destaques.map(({ icon: Icon, titulo, texto }) => (
          <div className="card feature" key={titulo}>
            <Icon size={28} color="var(--green-600)" />
            <h3>{titulo}</h3>
            <p className="muted">{texto}</p>
          </div>
        ))}
      </section>

      <footer className="home-footer muted">
        Projeto Integrador · EcoVida — solução IoT para reciclagem.
      </footer>
    </div>
  );
}
