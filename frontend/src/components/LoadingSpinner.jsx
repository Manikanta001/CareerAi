import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ fullScreen = false, message = 'Loading CareerAI platform...' }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
      <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
      <p className="text-sm font-medium text-slate-400">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
