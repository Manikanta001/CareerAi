import React from 'react';
import { Bot, MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const FloatingAssistant = () => {
  const { pathname } = useLocation();

  if (pathname === '/assistant') return null;

  return (
    <Link
      to="/assistant"
      aria-label="Open CareerAI placement assistant"
      title="CareerAI Assistant"
      className="group fixed bottom-5 right-5 z-[60] inline-flex items-center gap-2.5 rounded-full border border-blue-500/30 bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-xl shadow-blue-900/20 transition duration-200 hover:-translate-y-1 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 sm:bottom-7 sm:right-7"
    >
      <span className="relative inline-flex h-6 w-6 items-center justify-center">
        <Bot className="h-6 w-6" aria-hidden="true" />
        <MessageCircle className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-blue-600" aria-hidden="true" />
      </span>
      <span>AI Assistant</span>
    </Link>
  );
};

export default FloatingAssistant;
