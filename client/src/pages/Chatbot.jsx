import { useState } from 'react';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I am your career assistant.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'This is a sample reply from the chatbot.' },
      ]);
      setLoading(false);
    }, 1000);
  };

  const clearChat = () => {
    setMessages([{ role: 'bot', text: 'Chat cleared!' }]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">Career Chatbot</h1>

      <div className="w-full max-w-2xl bg-gray-800 rounded-lg p-4 flex-1 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-3 p-3 rounded-lg ${
              msg.role === 'user'
                ? 'bg-teal-600 text-right'
                : 'bg-gray-700 text-left'
            }`}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="bg-gray-700 p-3 rounded-lg">Typing...</div>
        )}
      </div>

      <form onSubmit={handleSend} className="w-full max-w-2xl flex gap-2">
        <button
          type="button"
          onClick={clearChat}
          className="bg-red-500 px-4 py-2 rounded-lg"
        >
          Clear
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 px-4 py-2 rounded-lg text-black"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-teal-500 px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </form>
    </div>
  );
}