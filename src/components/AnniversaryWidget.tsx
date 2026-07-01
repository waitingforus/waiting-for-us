import React from 'react';
import { Heart } from 'lucide-react';
import type { CoupleSettings } from '../lib/types';

export function AnniversaryWidget({ settings }: { settings: CoupleSettings | null }) {
  if (!settings?.anniversaryDate) return null;

  const getAnniversaryInfo = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Parse the anniversary date (assume YYYY-MM-DD)
    const [year, month, day] = dateString.split('-').map(Number);
    const annivDate = new Date(year, month - 1, day);
    
    // Create this year's anniversary date
    let currentYearAnniv = new Date(today.getFullYear(), month - 1, day);
    
    // If it already passed this year, look at next year
    if (currentYearAnniv < today) {
      currentYearAnniv = new Date(today.getFullYear() + 1, month - 1, day);
    }
    
    const diffTime = currentYearAnniv.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate years together
    let yearsTogether = currentYearAnniv.getFullYear() - year;
    if (currentYearAnniv > today && currentYearAnniv.getFullYear() === today.getFullYear()) {
      yearsTogether = today.getFullYear() - year; // Not yet celebrated this year
    }
    if (diffDays === 0) {
      yearsTogether = today.getFullYear() - year; // Today!
    }
    
    return { diffDays, yearsTogether };
  };

  const { diffDays, yearsTogether } = getAnniversaryInfo(settings.anniversaryDate);

  if (diffDays === 0) {
    return (
      <div className="bg-gradient-to-r from-pink-400 to-rose-400 rounded-2xl p-6 text-white shadow-xl shadow-pink-500/20 relative overflow-hidden animate-fade-in">
        <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <Heart className="w-12 h-12 text-white fill-white animate-bounce mb-3" />
          <h3 className="text-2xl font-black tracking-tight mb-1">¡Feliz Aniversario!</h3>
          <p className="font-medium text-pink-50">
            Celebrando {yearsTogether} {yearsTogether === 1 ? 'año' : 'años'} juntos. ¡Sigan ahorrando por sus sueños!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm flex items-center gap-4 animate-fade-in">
      <div className="bg-pink-50 p-3 rounded-full shrink-0">
        <Heart className="w-6 h-6 text-pink-400 fill-pink-100" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-800">Próximo Aniversario</h4>
        <p className="text-xs text-slate-500 font-medium">
          Faltan <span className="font-extrabold text-pink-500">{diffDays} días</span> para cumplir {yearsTogether} {yearsTogether === 1 ? 'año' : 'años'}.
        </p>
      </div>
    </div>
  );
}
