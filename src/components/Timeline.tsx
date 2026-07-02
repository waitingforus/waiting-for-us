import { Card, CardContent } from './ui/Card';
import { Activity, SmilePlus, X } from 'lucide-react';
import type { Goal, Contribution, UserProfile } from '../lib/types';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useState, useRef, useEffect } from 'react';

export function Timeline({ contributions, goals, allUsers = {} }: { contributions: Contribution[], goals: Goal[], allUsers?: Record<string, UserProfile> }) {
  const recentContributions = [...contributions]
    .sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0))
    .slice(0, 10);

  const formatDate = (date: any) => {
    if (!date) return '';
    return date.toDate().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const [activeReactionId, setActiveReactionId] = useState<string | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setActiveReactionId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleReact = async (contributionId: string, emoji: string) => {
    if (!contributionId) return;
    try {
      const docRef = doc(db, 'contributions', contributionId);
      await updateDoc(docRef, { reaction: emoji });
      setActiveReactionId(null);
    } catch (error) {
      console.error("Error al reaccionar:", error);
    }
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
                <div key={contribution.id} className="flex gap-4 relative group">
                  <div className="w-px h-full bg-slate-200 absolute left-[15px] top-8 -z-10"></div>
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center shrink-0 border-2 border-white shadow-sm text-brand-600 font-bold text-xs uppercase">
                    {displayName.charAt(0)}
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 flex-1 border border-slate-100 relative">
                    <p className="text-sm text-slate-700">
                      <strong className="text-slate-900">{displayName}</strong> aportó <strong className="text-brand-600">S/ {contribution.amount}</strong> a <strong className="text-slate-800">{getGoalName(contribution.goalId)}</strong>.
                    </p>
                    <span className="text-xs text-slate-400 font-bold mt-1 block uppercase tracking-widest">{formatDate(contribution.createdAt)}</span>
                    
                    {/* Reacciones */}
                    <div className="absolute -bottom-3 right-3 flex items-center gap-1">
                      {contribution.reaction ? (
                        <div className="group/reaction bg-white border border-slate-200 shadow-sm rounded-full px-2 py-0.5 flex items-center justify-center gap-1 text-sm cursor-pointer hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors"
                             onClick={() => handleReact(contribution.id!, '')}
                             title="Quitar reacción"
                        >
                          <span className="group-hover/reaction:opacity-50">{contribution.reaction}</span>
                          <X className="w-3 h-3 hidden group-hover/reaction:block" />
                        </div>
                      ) : (
                        <div className="relative" ref={activeReactionId === contribution.id ? pickerRef : null}>
                          {activeReactionId === contribution.id ? (
                            <div className="flex bg-white border border-slate-200 shadow-sm rounded-full p-1 gap-1 animate-in fade-in zoom-in duration-200">
                              {['💖', '🚀', '🎉', '👏', '🔥'].map(emoji => (
                                <button 
                                  key={emoji}
                                  onClick={() => handleReact(contribution.id!, emoji)}
                                  className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded-full text-sm transition-colors"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <button 
                              onClick={() => setActiveReactionId(contribution.id!)}
                              className="w-6 h-6 bg-white border border-slate-200 shadow-sm rounded-full flex items-center justify-center text-slate-400 hover:text-brand-500 hover:border-brand-300 transition-colors"
                              title="Reaccionar"
                            >
                              <SmilePlus className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
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
