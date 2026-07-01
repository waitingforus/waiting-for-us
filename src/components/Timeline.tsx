import { Card, CardContent } from './ui/Card';
import { Activity } from 'lucide-react';
import type { Goal, Contribution, UserProfile } from '../lib/types';

export function Timeline({ contributions, goals, allUsers = {} }: { contributions: Contribution[], goals: Goal[], allUsers?: Record<string, UserProfile> }) {
  const recentContributions = [...contributions]
    .sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0))
    .slice(0, 10);

  const formatDate = (date: any) => {
    if (!date) return '';
    return date.toDate().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const getGoalName = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    return goal ? goal.name : 'una meta eliminada';
  };

  return (
    <Card className="bg-white border-0 shadow-sm overflow-hidden h-full">
      <div className="bg-slate-50 border-b border-slate-100 p-4 sm:px-6">
        <h3 className="font-extrabold text-slate-800 flex items-center gap-2">
          <Activity className="w-5 h-5 text-brand-500" />
          Actividad Reciente
        </h3>
      </div>
      <CardContent className="p-0">
        <div className="max-h-[400px] overflow-y-auto p-4 sm:p-6 space-y-4">
          {recentContributions.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">Aún no hay actividad registrada.</p>
          ) : (
            recentContributions.map(contribution => {
              const userProfile = allUsers[contribution.user];
              const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
              const displayName = userProfile?.firstName ? capitalize(userProfile.firstName) : capitalize(contribution.user);

              return (
                <div key={contribution.id} className="flex gap-4 relative">
                  <div className="w-px h-full bg-slate-200 absolute left-[15px] top-8 -z-10"></div>
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center shrink-0 border-2 border-white shadow-sm text-brand-600 font-bold text-xs uppercase">
                    {displayName.charAt(0)}
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 flex-1 border border-slate-100">
                    <p className="text-sm text-slate-700">
                      <strong className="text-slate-900">{displayName}</strong> aportó <strong className="text-brand-600">S/ {contribution.amount}</strong> a <strong className="text-slate-800">{getGoalName(contribution.goalId)}</strong>.
                    </p>
                    <span className="text-xs text-slate-400 font-bold mt-1 block uppercase tracking-widest">{formatDate(contribution.createdAt)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
