import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recycle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import './Login.css';

type Mode = 'login' | 'registro';

export function Login() {
  const { login, registrar } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirma, setConfirma] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetMsgs = () => setErro(null);

  const extrairErro = (e: unknown, fallback: string) => {
    if (axios.isAxiosError(e)) {
      const data = e.response?.data as { mensagem?: string } | string | undefined;
      if (typeof data === 'string') return data;
      if (data?.mensagem) return data.mensagem;
      if (e.response?.status === 401) return 'Credenciais inválidas.';
    }
    return fallback;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    resetMsgs();

    if (mode === 'registro' && senha !== confirma) {
      setErro('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, senha);
        navigate('/dashboard', { replace: true });
      } else {
        await registrar(nome, email, senha);
        // Após registrar, autentica direto.
        await login(email, senha);
        navigate('/dashboard', { replace: true });
      }
    } catch (e) {
      setErro(extrairErro(e, 'Não foi possível concluir. Tente novamente.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="card login-card">
        <div className="brand">
          <Recycle size={28} color="var(--green-600)" />
          <span>EcoVida</span>
        </div>

        <div className="tabs">
          <button
            className={`tab${mode === 'login' ? ' active' : ''}`}
            onClick={() => { setMode('login'); resetMsgs(); }}
            type="button"
          >
            Entrar
          </button>
          <button
            className={`tab${mode === 'registro' ? ' active' : ''}`}
            onClick={() => { setMode('registro'); resetMsgs(); }}
            type="button"
          >
            Cadastrar
          </button>
        </div>

        {erro && <div className="alert-error">{erro}</div>}

        <form onSubmit={handleSubmit}>
          {mode === 'registro' && (
            <div className="field">
              <label htmlFor="nome">Nome</label>
              <input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </div>
          )}

          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {mode === 'registro' && (
            <div className="field">
              <label htmlFor="confirma">Confirmar senha</label>
              <input
                id="confirma"
                type="password"
                value={confirma}
                onChange={(e) => setConfirma(e.target.value)}
                required
                minLength={6}
              />
            </div>
          )}

          <button className="btn btn-primary full" type="submit" disabled={loading}>
            {loading ? 'Aguarde…' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>
      </div>
    </div>
  );
}
