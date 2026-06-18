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

export function Chatbot() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    { id: 0, texto: 'Olá! Sou o assistente da produção. Pergunte sobre refugos, sensores, peças e datas.', autor: 'bot' },
  ]);
  const [entrada, setEntrada] = useState('');
  const [enviando, setEnviando] = useState(false);
  const fimRef = useRef<HTMLDivElement>(null);

  const rolarParaFim = () => {
    requestAnimationFrame(() => fimRef.current?.scrollIntoView({ behavior: 'smooth' }));
  };

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    const texto = entrada.trim();
    if (!texto || enviando) return;

    const minha: Mensagem = { id: proximoId++, texto, autor: 'user' };
    setMensagens((m) => [...m, minha]);
    setEntrada('');
    setEnviando(true);
    rolarParaFim();

    try {
      const resposta = await perguntarChatbot(texto);
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
