import React, { useState, useEffect } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { X, User, Heart } from 'lucide-react';
import type { UserProfile, CoupleSettings } from '../lib/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  userProfile: UserProfile | null;
  coupleSettings: CoupleSettings | null;
}

export function SettingsModal({
  isOpen,
  onClose,
  username,
  userProfile,
  coupleSettings
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'couple'>('profile');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [anniversaryDate, setAnniversaryDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFirstName(userProfile?.firstName || '');
      setLastName(userProfile?.lastName || '');
      setBirthday(userProfile?.birthday || '');
      setAnniversaryDate(coupleSettings?.anniversaryDate || '');
    }
  }, [isOpen, userProfile, coupleSettings]);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setDoc(doc(db, 'users', username), {
        firstName,
        lastName,
        birthday,
        updatedAt: serverTimestamp()
      }, { merge: true });
      onClose(); // Cerrar al instante (UI Optimista)
    } catch (error) {
      console.error("Error al guardar perfil:", error);
    }
  };

  const handleSaveCouple = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const currentLinked = coupleSettings?.linkedUsers || [];
      const newLinked = currentLinked.includes(username) ? currentLinked : [...currentLinked, username];
      
      setDoc(doc(db, 'settings', 'couple'), {
        anniversaryDate,
        linkedUsers: newLinked,
        updatedAt: serverTimestamp()
      }, { merge: true });
      onClose(); // Cerrar al instante (UI Optimista)
    } catch (error) {
      console.error("Error al guardar configuración de pareja:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col transform transition-all">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
          <h3 className="text-xl font-bold text-slate-800">Configuración</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-2 pt-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'profile' 
                ? 'border-brand-500 text-brand-600' 
                : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300'
            }`}
          >
            <User className="w-4 h-4" /> Mi Perfil
          </button>
          <button
            onClick={() => setActiveTab('couple')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'couple' 
                ? 'border-accent-500 text-accent-600' 
                : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300'
            }`}
          >
            <Heart className="w-4 h-4" /> Pareja
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 animate-fade-in">
              <h4 className="text-sm uppercase font-extrabold text-slate-400 tracking-widest mb-4">Datos Personales</h4>
              <Input
                label="Nombre"
                placeholder="Ej: Juan"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={loading}
              />
              <Input
                label="Apellidos"
                placeholder="Ej: Pérez"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={loading}
              />
              <Input
                type="date"
                label="Fecha de Cumpleaños"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                disabled={loading}
              />
              <div className="pt-4 flex justify-end">
                <Button type="submit" isLoading={loading}>Guardar Perfil</Button>
              </div>
            </form>
          )}

          {activeTab === 'couple' && (
            <form onSubmit={handleSaveCouple} className="space-y-4 animate-fade-in">
              <h4 className="text-sm uppercase font-extrabold text-accent-400 tracking-widest mb-4">Nuestro Aniversario</h4>
              <Input
                label="Fecha de Aniversario"
                type="date"
                value={anniversaryDate}
                onChange={(e) => setAnniversaryDate(e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-slate-500 mt-2">
                Esta fecha se compartirá con tu pareja para celebrar sus hitos.
              </p>
              <div className="pt-4 flex justify-end">
                <Button type="submit" isLoading={loading} className="!bg-accent-500 hover:!bg-accent-600 !shadow-accent-500/20">
                  Guardar Pareja
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
