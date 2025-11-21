import React from 'react';
import { ScanEye } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 sm:px-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <ScanEye className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              VisionAI
            </h1>
            <p className="text-xs text-slate-500 font-medium">Powered by Gemini 2.5 Flash Image</p>
          </div>
        </div>
        <a 
          href="#" 
          className="text-sm text-slate-400 hover:text-indigo-400 transition-colors hidden sm:block"
        >
          Documentation
        </a>
      </div>
    </header>
  );
};
