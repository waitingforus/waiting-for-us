import React, { useState, useEffect } from 'react';
import { collection, doc, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Header } from './Header';
import { NewGoal } from './NewGoal';
import { GoalCard } from './GoalCard';
import { GoalDetail } from './GoalDetail';
import { GlobalSummary } from './GlobalSummary';
import { Timeline } from './Timeline';
import { Trophies } from './Trophies';
import { Wishlist } from './Wishlist';
import { SettingsModal } from './SettingsModal';
import { AnniversaryWidget } from './AnniversaryWidget';
import { BirthdayWidget } from './BirthdayWidget';
import { RouletteScreen } from './RouletteScreen';
import { MapScreen } from './MapScreen';
import { BottomNav } from './BottomNav';
import { Target } from 'lucide-react';
import { goalConverter, contributionConverter, userProfileConverter, coupleSettingsConverter, type Goal, type Contribution, type UserProfile, type CoupleSettings } from '../lib/types';

export default function Dashboard({ user }: { user: any }) {
  const username = user?.email?.split('@')[0] || 'Usuario';
  const [goals, setGoals] = useState<Goal[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const selectedGoal = goals.find(g => g.id === selectedGoalId) || null;
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [partnerProfile, setPartnerProfile] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<Record<string, UserProfile>>({});
  const [coupleSettings, setCoupleSettings] = useState<CoupleSettings | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'roulette' | 'map'>('dashboard');

  useEffect(() => {
    const qGoals = query(collection(db, 'goals').withConverter(goalConverter), orderBy('createdAt', 'desc'));
    const unsubGoals = onSnapshot(qGoals, (snapshot) => {
      const goalsData = snapshot.docs.map(doc => doc.data());
      setGoals(goalsData);
      
      // selectedGoal is now derived from goals state, no need to manually update it
    });

    const qContributions = query(collection(db, 'contributions').withConverter(contributionConverter), orderBy('createdAt', 'desc'));
    const unsubContributions = onSnapshot(qContributions, (snapshot) => {
      const contributionsData = snapshot.docs.map(doc => doc.data());
      setContributions(contributionsData);
    });
    
    const unsubAllUsers = onSnapshot(collection(db, 'users').withConverter(userProfileConverter), (snapshot) => {
      const usersData = snapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data();
        return acc;
      }, {} as Record<string, UserProfile>);
      setAllUsers(usersData);
      if (usersData[username]) setUserProfile(usersData[username]);
      
      const partnerKey = Object.keys(usersData).find(k => k !== username);
      if (partnerKey) setPartnerProfile(usersData[partnerKey]);
    });

    const unsubSettings = onSnapshot(doc(db, 'settings', 'couple').withConverter(coupleSettingsConverter), (docSnap) => {
      if (docSnap.exists()) setCoupleSettings(docSnap.data());
    });

    return () => {
      unsubGoals();
      unsubContributions();
      unsubAllUsers();
      unsubSettings();
    };
  }, [username]);

  return (
    <>
      <Header 
        username={username} 
        userProfile={userProfile} 
        onOpenSettings={() => setIsSettingsOpen(true)} 
        currentView={currentView}
        onNavigate={setCurrentView}
      />

      {currentView === 'roulette' ? (
        <RouletteScreen settings={coupleSettings} />
      ) : currentView === 'map' ? (
        <MapScreen username={username} allUsers={allUsers} />
      ) : selectedGoal ? (
        <GoalDetail 
          goal={selectedGoal} 
          contributions={contributions.filter(c => c.goalId === selectedGoal.id)}
          username={username}
          onBack={() => setSelectedGoalId(null)} 
        />
      ) : (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 pb-32 sm:pb-12 animate-fade-in mt-32">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
            
            {/* Left Column: Objetivos */}
            <div className="lg:col-span-2">
              <NewGoal username={username} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {goals.length === 0 ? (
                  <div className="col-span-full text-center py-16 px-4 bg-white rounded-2xl border border-brand-50 shadow-sm">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-100 mb-6 shadow-inner">
                      <Target className="w-10 h-10 text-brand-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Aún no hay metas</h3>
                    <p className="text-slate-500 font-medium">Empieza creando una arriba.</p>
                  </div>
                ) : (
                  goals.map((goal: Goal) => (
                    <GoalCard 
                      key={goal.id} 
                      goal={goal} 
                      contributions={contributions.filter(c => c.goalId === goal.id)}
                      onClick={() => setSelectedGoalId(goal.id!)}
                    />
                  ))
                )}
              </div>
            </div>
            
            {/* Right Column: Resumen y Actividad */}
            <div className="lg:col-span-1 flex flex-col gap-8">
              <AnniversaryWidget settings={coupleSettings} />
              <BirthdayWidget partnerProfile={partnerProfile} />
              <GlobalSummary contributions={contributions} username={username} />
              <Timeline contributions={contributions} goals={goals} allUsers={allUsers} />
            </div>

          </div>

          {/* Trofeos y Wishlist en la parte inferior */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            <Trophies contributions={contributions} goals={goals} />
            <Wishlist username={username} />
          </div>

        </div>
      )}

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        username={username}
        userProfile={userProfile}
        coupleSettings={coupleSettings}
      />

      <BottomNav 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        onOpenSettings={() => setIsSettingsOpen(true)} 
      />
    </>
  );
}