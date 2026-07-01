import { auth } from '../lib/firebase';
import { Button } from './ui/Button';
import { Settings } from 'lucide-react';
import type { UserProfile } from '../lib/types';

export function Header({ 
  username, 
  userProfile, 
  onOpenSettings 
}: { 
  username: string, 
  userProfile?: UserProfile | null,
  onOpenSettings?: () => void 
}) {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-brand-200 to-accent-200 text-slate-800 shadow-md border-b border-brand-300/30 backdrop-blur-sm">
      <div className="max-w-9xl mx-auto flex justify-between items-center p-6 sm:px-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-sm text-slate-800">
            Hola, {userProfile?.firstName ? capitalize(userProfile.firstName) : capitalize(username)}
          </h1>
          <p className="text-sm sm:text-base font-medium mt-1 text-slate-600">¿Qué objetivo cumpliremos hoy?</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenSettings}
            className="p-2 text-slate-600 hover:bg-white/40 hover:text-slate-900 rounded-xl transition-colors border border-transparent hover:border-white/50"
            title="Configuración"
          >
            <Settings className="w-5 h-5" />
          </button>
          <Button 
            variant="ghost" 
            onClick={() => auth.signOut()}
            className="text-slate-700 hover:bg-white/40 hover:text-slate-900 focus:ring-white/50 border border-white/50 rounded-xl flex shadow-sm bg-white/20"
          >
            Salir
          </Button>
        </div>
      </div>
    </div>
  );
}
