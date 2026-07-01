import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { PlusCircle } from 'lucide-react';
import { goalConverter, type Goal } from '../lib/types';

export function NewGoal({ username }: { username: string }) {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [cargando, setCargando] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !targetAmount) return;

    setCargando(true);
    try {
      const goalRef = collection(db, 'goals').withConverter(goalConverter);
      // Fire and forget (Optimistic UI)
      addDoc(goalRef, {
        name: name.trim(),
        targetAmount: Number(targetAmount),
        createdBy: username,
        createdAt: serverTimestamp() as any, // Firebase serverTimestamp isn't perfectly typed as Timestamp before it hits the server
      });
      setName('');
      setTargetAmount('');
      setIsExpanded(false);
    } catch (error) {
      console.error("Error al crear la meta:", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="mb-8">
      {!isExpanded ? (
        <div className="flex justify-between items-center bg-white/50 p-4 rounded-2xl border border-brand-100 shadow-sm backdrop-blur-sm">
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Mis Objetivos</h2>
          <Button onClick={() => setIsExpanded(true)} className="px-6 py-2 shadow-brand-500/30 shadow-lg">
            <PlusCircle className="w-4 h-4 mr-2" /> Nuevo Objetivo
          </Button>
        </div>
      ) : (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-brand-900/5 border border-brand-50 transition-all animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Crear un nuevo objetivo</h2>
              <p className="text-slate-500 font-medium text-sm mt-1">Define una meta clara y empiecen a ahorrar juntos.</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-1/2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">¿Qué quieren lograr?</label>
              <Input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Objetivo..."
                required
                disabled={cargando}
                className="bg-slate-50"
              />
            </div>
            
            <div className="w-full md:w-1/3">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">¿Cuánto necesitan?</label>
              <Input 
                type="number" 
                value={targetAmount} 
                onChange={(e) => setTargetAmount(e.target.value)} 
                placeholder="0.00"
                required
                min="1"
                prefixStr="S/"
                disabled={cargando}
                className="bg-slate-50"
              />
            </div>

            <div className="w-full md:w-auto flex gap-2">
              <Button type="button" variant="secondary" onClick={() => setIsExpanded(false)} disabled={cargando} className="py-3.5 px-6">
                Cancelar
              </Button>
              <Button type="submit" isLoading={cargando} className="flex-1 py-3.5 px-8">
                Crear Meta
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
