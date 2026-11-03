import React, { useState } from 'react';
import { performanceService } from '../../services/performanceService';
import { Bot, Send, User, Sparkles } from 'lucide-react';

const Assistant = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Hello! I am your CareerAI placement mentor. How can I help you prepare for technical interviews, improve your resume score, or close your skill gaps today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await performanceService.askAssistant(userMsg);
      const reply = res.data?.reply || 'I am ready to assist with your placement preparation goals!';
      setMessages(prev => [...prev, { sender: 'assistant', text: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'assistant', text: 'I am currently operating in offline mode. Please try asking about resume scores or DSA practice!' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Bot className="h-6 w-6 text-brand-400" /> CareerAI Placement Assistant
        </h1>
        <p className="text-xs text-slate-400">Interactive mentor for placement guidance, resume tips, and interview coaching</p>
      </div>

      <div className="glass-panel h-[500px] rounded-3xl p-6 flex flex-col justify-between border border-slate-800">
        {/* Messages scroll area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                m.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                m.sender === 'user'
                  ? 'bg-brand-600 text-white'
                  : 'bg-indigo-600/30 border border-indigo-500/40 text-indigo-400'
              }`}>
                {m.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div className={`p-4 rounded-2xl text-xs max-w-lg leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-brand-600 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}>
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Bot className="h-4 w-4 text-brand-400 animate-spin" /> Thinking...
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="pt-4 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about resume tips, DSA roadmap, SQL Joins..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-brand-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-600/20 disabled:opacity-50 transition-all flex items-center gap-1.5"
          >
            <Send className="h-4 w-4" /> Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Assistant;
