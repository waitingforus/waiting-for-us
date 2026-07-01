import { Card, CardContent } from './ui/Card';
import type { Goal, Contribution } from '../lib/types';

export function GoalCard({ goal, contributions, onClick }: { goal: Goal, contributions: Contribution[], onClick: () => void }) {
  const totalSaved = contributions.reduce((sum, c) => sum + (c.amount || 0), 0);
  const percentage = Math.min((totalSaved / goal.targetAmount) * 100, 100).toFixed(1);

  return (
    <Card 
      onClick={onClick}
      className="cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-brand-900/10 active:scale-[0.98] border-0 bg-white group overflow-hidden"
    >
      <div className="h-2 w-full bg-slate-100 relative">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-400 to-accent-400 transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <CardContent className="p-6 sm:p-8">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-extrabold text-slate-800 group-hover:text-brand-600 transition-colors tracking-tight">{goal.name}</h3>
          <span className="text-xs font-bold px-3 py-1 bg-brand-50 text-brand-600 rounded-full border border-brand-100 shadow-sm uppercase tracking-wider">
            {percentage}%
          </span>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Ahorrado</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-800 tracking-tighter">S/ {totalSaved}</span>
            <span className="text-lg font-bold text-slate-400">/ {goal.targetAmount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
