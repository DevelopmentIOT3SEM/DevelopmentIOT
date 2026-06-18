import { useRef, useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';
import { perguntarChatbot } from '@/services/api';
import './Chatbot.css';

interface Mensagem {
  id: number;
  texto: string;
  autor: 'user' | 'bot';
}

let proximoId = 1;

const SUGESTOES = ['Resumo', 'Taxa de refugo', 'Status dos sensores', 'Comparar materiais', 'Melhor dia'];

export function Chatbot() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      id: 0,
      autor: 'bot',
      texto:
        'Olá! 👋 Sou o assistente da produção. Pergunte sobre refugos, sensores, ' +
        'peças, eficiência ou peça um resumo. Digite "ajuda" para ver tudo.',
    },
  ]);
  const [entrada, setEntrada] = useState('');
  const [enviando, setEnviando] = useState(false);
  const fimRef = useRef<HTMLDivElement>(null);

  const rolarParaFim = () => {
    requestAnimationFrame(() => fimRef.current?.scrollIntoView({ behavior: 'smooth' }));
  };

  const enviarTexto = async (texto: string) => {
    const limpo = texto.trim();
    if (!limpo || enviando) return;

    setMensagens((m) => [...m, { id: proximoId++, texto: limpo, autor: 'user' }]);
    setEntrada('');
    setEnviando(true);
    rolarParaFim();

    try {
      const resposta = await perguntarChatbot(limpo);
      setMensagens((m) => [...m, { id: proximoId++, texto: resposta, autor: 'bot' }]);
    } catch {
      setMensagens((m) => [
        ...m,
        { id: proximoId++, texto: 'Não consegui falar com o servidor agora. Tente novamente.', autor: 'bot' },
      ]);
    } finally {
      setEnviando(false);
      rolarParaFim();
    }
  };

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    void enviarTexto(entrada);
  };

  return (
    <div className="chatbot">
      <h1>Assistente</h1>
      <p className="muted">Tire dúvidas sobre a produção em linguagem natural.</p>

      <div className="card chat">
        <div className="chat-mensagens">
          {mensagens.map((m) => (
            <div key={m.id} className={`bolha ${m.autor}`}>
              {m.texto}
            </div>
          ))}
          {enviando && <div className="bolha bot digitando">Digitando…</div>}
          <div ref={fimRef} />
        </div>

        <div className="chat-sugestoes">
          {SUGESTOES.map((s) => (
            <button
              key={s}
              type="button"
              className="chip"
              onClick={() => void enviarTexto(s)}
              disabled={enviando}
            >
              {s}
            </button>
          ))}
        </div>

        <form className="chat-input" onSubmit={enviar}>
          <input
            value={entrada}
            onChange={(e) => setEntrada(e.target.value)}
            placeholder="Ex.: qual a taxa de refugo?"
            maxLength={200}
          />
          <button className="btn btn-primary" type="submit" disabled={enviando || !entrada.trim()}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
