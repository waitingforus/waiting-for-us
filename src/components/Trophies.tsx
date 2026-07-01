import { Card, CardContent } from './ui/Card';
import { Award, Star, Zap, ShieldCheck } from 'lucide-react';
import type { Goal, Contribution } from '../lib/types';

export function Trophies({ contributions, goals }: { contributions: Contribution[], goals: Goal[] }) {
  const totalSaved = contributions.reduce((sum, c) => sum + (c.amount || 0), 0);
  const completedGoals = goals.filter(g => {
    const sum = contributions.filter(c => c.goalId === g.id).reduce((s, c) => s + (c.amount || 0), 0);
    return sum >= g.targetAmount;
  }).length;

  const badges = [
    {
      id: 'first_goal',
      title: 'El Primer Paso',
      desc: 'Crearon su primera meta',
      icon: <Star className="w-6 h-6" />,
      unlocked: goals.length > 0,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      id: 'savings_1000',
      title: 'Club de los S/ 1,000',
      desc: 'Han ahorrado sus primeros mil',
      icon: <ShieldCheck className="w-6 h-6" />,
      unlocked: totalSaved >= 1000,
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      id: 'savings_5000',
      title: 'Ahorradores Pro',
      desc: 'Superaron los S/ 5,000',
      icon: <Zap className="w-6 h-6" />,
      unlocked: totalSaved >= 5000,
      color: 'bg-accent-100 text-accent-600',
    },
    {
      id: 'goal_completed',
      title: '¡Meta Lograda!',
      desc: 'Completaron al 100% un objetivo',
      icon: <Award className="w-6 h-6" />,
      unlocked: completedGoals > 0,
      color: 'bg-rose-100 text-rose-600',
    }
  ];

  return (
    <Card className="bg-white border-0 shadow-sm h-full">
      <div className="bg-slate-50 border-b border-slate-100 p-4 sm:px-6 flex justify-between items-center">
        <h3 className="font-extrabold text-slate-800 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          Trofeos
        </h3>
        <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
          {badges.filter(b => b.unlocked).length} / {badges.length}
        </span>
      </div>
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-4">
          {badges.map(badge => (
            <div key={badge.id} className={`p-4 rounded-2xl flex flex-col items-center text-center transition-all ${badge.unlocked ? 'bg-white border border-slate-100 shadow-sm' : 'bg-slate-50 opacity-50 grayscale'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${badge.unlocked ? badge.color : 'bg-slate-200 text-slate-400'}`}>
                {badge.icon}
              </div>
              <h4 className="font-extrabold text-sm text-slate-800 leading-tight mb-1">{badge.title}</h4>
              <p className="text-[10px] text-slate-500 font-medium leading-snug">{badge.desc}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
