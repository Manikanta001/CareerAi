import React, { useState } from 'react';
import { performanceService } from '../../services/performanceService';
import { Bot, Send, User, Sparkles } from 'lucide-react';

const QUICK_PROMPTS = [
  'Make me a study plan for campus placements',
  'Explain a DSA problem step by step',
  'Explain DBMS joins with an example',
  'Quiz me on aptitude, OS, or computer networks',
];

const Assistant = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Hi! I’m CareerAI. Ask me about DSA, aptitude, logical reasoning, verbal ability, programming, OOP, DBMS, SQL, operating systems, networks, software engineering, interviews, resumes, or placement plans.'
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
      const reply = res?.reply;
      if (!reply) throw new Error('The assistant returned an empty response.');
      setMessages(prev => [...prev, { sender: 'assistant', text: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'assistant', text: `I couldn't get a response. ${err.message || 'Please try again.'}` }]);
    } finally {
      setLoading(false);
    }
  };

  const useQuickPrompt = (prompt) => {
    setInput(prompt);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Bot className="h-6 w-6 text-brand-400" /> CareerAI Placement Assistant
        </h1>
        <p className="text-xs text-slate-400">Interactive mentor for placement guidance, resume tips, and interview coaching</p>
      </div>

      <p role="note" className="rounded-xl border border-slate-700 bg-slate-900/70 p-3 text-xs leading-5 text-slate-400">
        When an OpenAI API key is configured, your message and selected profile, resume, and assessment details are sent to OpenAI to prepare a reply. Without a key, CareerAI uses built-in guidance.
      </p>

      <div className="flex flex-wrap gap-2">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => useQuickPrompt(prompt)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-brand-500/50 text-slate-300 text-xs transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 inline mr-1.5 text-brand-400" />
            {prompt}
          </button>
        ))}
      </div>

      <div className="glass-panel flex h-[min(70vh,600px)] min-h-[400px] flex-col justify-between rounded-3xl border border-slate-800 p-4 sm:p-6">
        {/* Messages scroll area */}
        <div className="flex-1 space-y-4 overflow-y-auto pr-2" aria-live="polite" aria-label="Conversation">
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
          <label className="sr-only" htmlFor="assistant-message">Your message</label><input
            id="assistant-message"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about placements, resume, DSA, MCQs, jobs, or interviews..."
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
