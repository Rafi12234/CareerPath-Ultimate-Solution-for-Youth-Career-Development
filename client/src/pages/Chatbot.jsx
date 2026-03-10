import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Chatbot() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hi there! I'm CareerPath AI — your personal career assistant. Ask me anything about jobs, skills, resumes, interviews, or career growth!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-load conversation history for logged-in users on mount
  useEffect(() => {
    if (!user) return;
    const fetchHistory = async () => {
      try {
        const res = await api.get('/chatbot/history');
        if (res.data.messages && res.data.messages.length > 0) {
          const historyMsgs = [];
          historyMsgs.push({
            role: 'bot',
            text: "Welcome back! Here's your previous conversation:",
          });
          res.data.messages.forEach((m) => {
            historyMsgs.push({ role: 'user', text: m.user_message });
            historyMsgs.push({ role: 'bot', text: m.bot_reply });
          });
          historyMsgs.push({
            role: 'bot',
            text: "── End of history ── Ask me anything new!",
          });
          setMessages(historyMsgs);
        }
      } catch {
        // Silently ignore — just use fresh chat
      }
    };
    fetchHistory();
  }, [user]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg = { role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chatbot', { message: trimmed });
      setMessages((prev) => [...prev, { role: 'bot', text: res.data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'bot',
        text: "Chat cleared! How can I help you?",
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-[#03070A] pt-28 pb-12 px-4">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-[#14b8a6]/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-[#06b6d4]/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-3xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 160px)' }}>
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#14b8a6]/[0.08] border border-[#14b8a6]/20 mb-4">
            <Sparkles size={14} className="text-[#14b8a6]" />
            <span className="text-xs font-semibold text-[#2dd4bf] uppercase tracking-wider">
              AI Powered
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            <span className="text-white">Career</span>
            <span
              style={{
                background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Path
            </span>{' '}
            <span className="text-white">AI Chat</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
            Ask me anything — career advice, resume tips, interview prep, skill roadmaps, and more.
          </p>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              style={{ animation: 'fadeInUp 0.3s ease both', animationDelay: `${i * 0.05}s` }}
            >
              {msg.role === 'bot' && (
                <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-[#14b8a6]/20 mt-1">
                  <Bot size={16} className="text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-[#14b8a6] to-[#0d9488] text-white rounded-tr-md'
                    : 'bg-white/[0.05] border border-white/[0.06] text-gray-300 rounded-tl-md'
                }`}
              >
                {msg.text}
              </div>
              {msg.role === 'user' && (
                <div className="shrink-0 w-8 h-8 rounded-xl bg-white/[0.08] border border-white/[0.1] flex items-center justify-center mt-1">
                  <User size={16} className="text-gray-400" />
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-[#14b8a6]/20 mt-1">
                <Bot size={16} className="text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white/[0.05] border border-white/[0.06]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#14b8a6] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#14b8a6] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#14b8a6] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="mt-4">
          <form onSubmit={handleSend} className="flex items-center gap-3">
            {/* Clear button */}
            <button
              type="button"
              onClick={clearChat}
              className="shrink-0 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-gray-500 hover:text-red-400 hover:bg-red-500/[0.06] hover:border-red-500/20 transition-all duration-300"
              title="Clear chat"
            >
              <Trash2 size={18} />
            </button>

            {/* Input */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full px-5 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#14b8a6]/40 focus:bg-white/[0.06] transition-all duration-300"
                disabled={loading}
                maxLength={2000}
              />
            </div>

            {/* Send button */}
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="shrink-0 p-3.5 rounded-2xl text-white font-bold transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 hover:shadow-[0_0_25px_-5px_rgba(20,184,166,0.4)]"
              style={{
                background: 'linear-gradient(135deg, #14b8a6, #0d9488, #06b6d4)',
              }}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </form>

          <p className="text-center text-[11px] text-gray-700 mt-3">
            Powered by Google Gemini AI — Responses may not always be accurate.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
