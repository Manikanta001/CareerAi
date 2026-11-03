import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

const Timer = ({ initialSeconds, onExpire }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (onExpire) onExpire();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onExpire]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const isUrgent = secondsLeft < 300; // less than 5 mins

  return (
    <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-sm font-mono font-bold transition-all ${
      isUrgent 
        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' 
        : 'bg-slate-800 text-slate-200 border-slate-700'
    }`}>
      <Clock className="h-4 w-4" />
      <span>
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </span>
    </div>
  );
};

export default Timer;
