import React from 'react';
import { Gift } from 'lucide-react';
import type { UserProfile } from '../lib/types';

export function BirthdayWidget({ partnerProfile }: { partnerProfile: UserProfile | null }) {
  if (!partnerProfile?.birthday) return null;

  const getBirthdayInfo = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Parse the birthday date (assume YYYY-MM-DD)
    const [year, month, day] = dateString.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day);
    
    // Create this year's birthday date
    let currentYearBday = new Date(today.getFullYear(), month - 1, day);
    
    // If it already passed this year, look at next year
    if (currentYearBday < today) {
      currentYearBday = new Date(today.getFullYear() + 1, month - 1, day);
    }
    
    const diffTime = currentYearBday.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate age
    let age = currentYearBday.getFullYear() - year;
    if (diffDays === 0 && currentYearBday.getFullYear() === today.getFullYear()) {
      age = today.getFullYear() - year;
    }
    
    return { diffDays, age };
  };

  const { diffDays, age } = getBirthdayInfo(partnerProfile.birthday);
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  const partnerName = partnerProfile.firstName 
    ? capitalize(partnerProfile.firstName)
    : (partnerProfile.id ? capitalize(partnerProfile.id) : 'tu pareja');

  if (diffDays === 0) {
    return (
      <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl p-6 text-white shadow-xl shadow-orange-500/20 relative overflow-hidden animate-fade-in">
        <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <Gift className="w-12 h-12 text-white fill-white animate-bounce mb-3" />
          <h3 className="text-2xl font-black tracking-tight mb-1">¡Feliz Cumpleaños!</h3>
          <p className="font-medium text-amber-50">
            {age > 0 
              ? `¡Hoy ${partnerName} cumple ${age} años!`
              : `¡Hoy es el cumpleaños de ${partnerName}!`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm flex items-center gap-4 animate-fade-in">
      <div className="bg-amber-50 p-3 rounded-full shrink-0">
        <Gift className="w-6 h-6 text-amber-500 fill-amber-100" />
      </div>
      <div>
        <h4 className="font-extrabold text-slate-700 text-sm">Cumpleaños de {partnerName}</h4>
        <p className="text-sm font-medium text-slate-500">
          Faltan <strong className="text-amber-500">{diffDays}</strong> días
        </p>
      </div>
    </div>
  );
}
