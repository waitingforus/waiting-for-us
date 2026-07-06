import React from 'react';
import { Home, Dices, Settings } from 'lucide-react';

interface BottomNavProps {
  currentView: 'dashboard' | 'roulette';
  onNavigate: (view: 'dashboard' | 'roulette') => void;
  onOpenSettings: () => void;
}

export function BottomNav({ currentView, onNavigate, onOpenSettings }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-t border-brand-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] sm:hidden pb-safe">
      <div className="flex justify-around items-center p-3">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center gap-1 p-2 w-20 rounded-2xl transition-all ${
            currentView === 'dashboard'
              ? 'text-brand-500 scale-110'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
        >
          <div className={`p-2 rounded-xl ${currentView === 'dashboard' ? 'bg-brand-50' : 'bg-transparent'}`}>
            <Home className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold">Inicio</span>
        </button>

        <button
          onClick={() => onNavigate('roulette')}
          className={`flex flex-col items-center gap-1 p-2 w-20 rounded-2xl transition-all ${
            currentView === 'roulette'
              ? 'text-brand-500 scale-110'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
        >
          <div className={`p-2 rounded-xl ${currentView === 'roulette' ? 'bg-brand-50' : 'bg-transparent'}`}>
            <Dices className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold">Ruleta</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="flex flex-col items-center gap-1 p-2 w-20 rounded-2xl transition-all text-slate-400 hover:text-slate-600 hover:bg-slate-50"
        >
          <div className="p-2 rounded-xl bg-transparent">
            <Settings className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold">Ajustes</span>
        </button>
      </div>
    </div>
  );
}
