import { Card, CardContent } from './ui/Card';
import { Wallet, TrendingUp } from 'lucide-react';
import type { Contribution } from '../lib/types';

export function GlobalSummary({ contributions, username }: { contributions: Contribution[], username: string }) {
  const totalSaved = contributions.reduce((sum, c) => sum + (c.amount || 0), 0);
  const myContributions = contributions.filter(c => c.user === username).reduce((sum, c) => sum + (c.amount || 0), 0);
  const partnerContributions = totalSaved - myContributions;
  
  const myPercentage = totalSaved > 0 ? ((myContributions / totalSaved) * 100).toFixed(0) : 0;
  const partnerPercentage = totalSaved > 0 ? ((partnerContributions / totalSaved) * 100).toFixed(0) : 0;

  return (
    <Card className="bg-white shadow-xl shadow-brand-900/5 border-0 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/4"></div>
      
      <CardContent className="p-6 relative z-10 flex flex-col gap-8">
        <div className="flex flex-col items-center text-center w-full">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 shrink-0">
            <Wallet className="w-8 h-8" />
          </div>
          <div className="mt-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Ahorro Total Juntos</h2>
            <p className="text-5xl font-black text-slate-800 tracking-tighter">S/ <span className="text-brand-500">{totalSaved}</span></p>
          </div>
        </div>

        {/* Competencia Sana */}
        <div className="w-full bg-slate-50 p-5 rounded-2xl border border-slate-100">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-brand-500" /> División de Aportes
            </span>
          </div>
          
          <div className="h-3 w-full bg-slate-200 rounded-full flex overflow-hidden mb-2">
            <div className="bg-brand-400 h-full transition-all duration-1000" style={{ width: `${myPercentage}%` }}></div>
            <div className="bg-accent-400 h-full transition-all duration-1000" style={{ width: `${partnerPercentage}%` }}></div>
          </div>
          
          <div className="flex justify-between text-xs font-bold">
            <span className="text-brand-600">Yo ({myPercentage}%)</span>
            <span className="text-accent-600">Mi Pareja ({partnerPercentage}%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
