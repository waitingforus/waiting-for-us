import React, { useState } from 'react';
import { collection, addDoc, doc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { ConfirmModal } from './ui/ConfirmModal';
import { ArrowLeft, Trash2, Lightbulb, Pencil } from 'lucide-react';
import { contributionConverter, type Goal, type Contribution } from '../lib/types';

const formatDate = (date: any) => {
  if (!date) return '';
  return date.toDate().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
};

export function GoalDetail({ goal, contributions, username, onBack }: { goal: Goal, contributions: Contribution[], username: string, onBack: () => void }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteGoalModal, setShowDeleteGoalModal] = useState(false);
  const [contributionToDelete, setContributionToDelete] = useState<string | null>(null);
  
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [editName, setEditName] = useState(goal.name);
  const [editAmount, setEditAmount] = useState(goal.targetAmount.toString());

  // Compute stats synchronously
  const totalSaved = contributions.reduce((sum, c) => sum + (c.amount || 0), 0);
  
  // Sort contributions to display timeline correctly
  const sortedContributions = [...contributions].sort((a, b) => {
    const timeA = a.createdAt?.toMillis() || 0;
    const timeB = b.createdAt?.toMillis() || 0;
    return timeB - timeA;
  });

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) return;

    setLoading(true);
    try {
      const contributionsRef = collection(db, 'contributions').withConverter(contributionConverter);
      // Fire and forget (Optimistic UI)
      addDoc(contributionsRef, {
        goalId: goal.id!,
        amount: amountNum,
        user: username,
        createdAt: serverTimestamp() as any,
      });
      setAmount('');
    } catch (error) {
      console.error("Error al guardar el aporte:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContribution = () => {
    if (contributionToDelete) {
      try {
        deleteDoc(doc(db, 'contributions', contributionToDelete));
      } catch (error) {
        console.error("Error al eliminar el aporte:", error);
      } finally {
        setContributionToDelete(null);
      }
    }
  };

  const percentage = Math.min((totalSaved / goal.targetAmount) * 100, 100).toFixed(1);

  const myContributions = sortedContributions.filter(c => c.user === username);
  const partnerContributions = sortedContributions.filter(c => c.user !== username);

  // Lógica de Proyección Inteligente
  const remaining = goal.targetAmount - totalSaved;
  const projectionMonths = 3; // Ejemplo estático: meta en 3 meses
  const suggestedMonthlyContribution = remaining > 0 ? (remaining / projectionMonths / 2).toFixed(0) : 0;

  const handleDeleteGoal = () => {
    try {
      deleteDoc(doc(db, 'goals', goal.id!));
      onBack();
    } catch (error) {
      console.error("Error al eliminar la meta:", error);
    }
    setShowDeleteGoalModal(false);
  };

  const handleUpdateGoal = async () => {
    const numAmount = Number(editAmount);
    if (!editName.trim() || isNaN(numAmount) || numAmount <= 0) return;
    try {
      await updateDoc(doc(db, 'goals', goal.id!), {
        name: editName.trim(),
        targetAmount: numAmount
      });
      setIsEditingGoal(false);
    } catch (error) {
      console.error("Error al actualizar la meta:", error);
    }
  };

  return (
    <div className="w-full max-w-9xl mx-auto px-4 sm:px-8 pb-12 animate-fade-in mt-32">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 font-bold mb-6 hover:text-brand-500 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Volver al Resumen
      </button>

      <Card className="flex flex-col border-0 relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-400 to-accent-400"></div>
        
        <CardContent className="flex flex-col gap-8 pt-8">
          {/* Header de la Meta */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            {isEditingGoal ? (
              <div className="w-full flex flex-col gap-4 animate-fade-in bg-white p-4 rounded-2xl border border-brand-100 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Nombre</label>
                    <Input 
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="w-full bg-slate-50"
                      placeholder="Nombre del objetivo"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Monto</label>
                    <Input 
                      type="number"
                      value={editAmount}
                      onChange={e => setEditAmount(e.target.value)}
                      className="w-full bg-slate-50"
                      prefixStr="S/"
                      placeholder="Monto"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end mt-2">
                  <Button variant="secondary" onClick={() => setIsEditingGoal(false)} className="py-2 px-4 text-sm">
                    Cancelar
                  </Button>
                  <Button onClick={handleUpdateGoal} className="py-2 px-4 text-sm">
                    Guardar
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{goal.name}</h2>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => {
                        setEditName(goal.name);
                        setEditAmount(goal.targetAmount.toString());
                        setIsEditingGoal(true);
                      }} 
                      className="text-slate-300 hover:text-brand-500 transition-colors p-1"
                      title="Editar meta de ahorro"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setShowDeleteGoalModal(true)} 
                      className="text-slate-300 hover:text-red-500 transition-colors p-1"
                      title="Eliminar meta de ahorro"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="text-5xl font-black text-brand-500 tracking-tighter drop-shadow-sm">
                  S/ {totalSaved} <span className="text-2xl text-slate-400 font-bold">/ S/ {goal.targetAmount}</span>
                </p>
              </div>
            )}
          </div>
          
          {/* Barra de progreso */}
          <div>
            <div className="w-full bg-brand-50 rounded-full h-5 mb-2 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-brand-400 to-accent-400 h-full rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <p className="text-right text-sm text-slate-500 font-bold uppercase tracking-wider">{percentage}% completado</p>
          </div>

          {/* Formulario de Aporte (Arriba del historial para fácil acceso) */}
          <div className="bg-brand-50/50 p-6 rounded-3xl border border-brand-100 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 w-full">
              <h4 className="text-sm uppercase font-extrabold text-slate-500 mb-4 tracking-widest">Nuevo Aporte</h4>
              <form onSubmit={handleContribute} className="flex flex-col sm:flex-row gap-4">
                <Input 
                  type="number" 
                  step="0.1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Monto a sumar"
                  prefixStr="S/"
                  disabled={loading}
                  className="flex-1 bg-white"
                />
                <Button type="submit" isLoading={loading} className="py-3.5 px-8">
                  Aportar
                </Button>
              </form>
            </div>
            
            {/* Proyección Inteligente Mini Panel */}
            {remaining > 0 && (
              <div className="w-full md:w-64 bg-white p-4 rounded-2xl border border-brand-100 shadow-sm flex flex-col justify-center shrink-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <Lightbulb className="w-3.5 h-3.5 text-accent-400" />
                  <span className="text-[10px] uppercase font-extrabold text-accent-400 tracking-widest">Dato Inteligente</span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Si cada uno aporta <strong className="text-accent-600">S/ {suggestedMonthlyContribution}</strong> al mes, alcanzarán esta meta en <strong className="text-slate-800">3 meses</strong>.
                </p>
              </div>
            )}
          </div>

          {/* Historial en Dos Columnas */}
          <div>
            <h4 className="text-sm uppercase font-extrabold text-slate-400 mb-5 tracking-widest text-center">Historial de Aportes</h4>
            <div className="flex flex-col md:flex-row gap-6">
              
              {/* Columna: Mis Aportes */}
              <div className="flex-1">
                <div className="text-sm font-bold text-center bg-brand-100 text-brand-700 py-3 rounded-t-2xl border border-b-0 border-brand-100">Yo</div>
                <div className="bg-brand-50/30 h-72 overflow-y-auto p-4 rounded-b-2xl border border-brand-100 space-y-3">
                  {myContributions.length === 0 && <p className="text-sm text-center text-slate-400 mt-10 font-medium">Sin registros</p>}
                  {myContributions.map(contribution => (
                    <div key={contribution.id} className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-brand-50 transition-transform hover:-translate-y-1 group">
                      <span className="text-xs text-slate-400 font-bold">{formatDate(contribution.createdAt)}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-lg text-slate-700">S/ {contribution.amount}</span>
                        <button 
                          onClick={() => setContributionToDelete(contribution.id!)}
                          className="text-slate-300 hover:text-red-500 transition-colors p-1"
                          title="Eliminar aporte"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Columna: Pareja */}
              <div className="flex-1">
                <div className="text-sm font-bold text-center bg-accent-100 text-accent-700 py-3 rounded-t-2xl border border-b-0 border-accent-100">Mi Pareja</div>
                <div className="bg-accent-50/30 h-72 overflow-y-auto p-4 rounded-b-2xl border border-accent-100 space-y-3">
                  {partnerContributions.length === 0 && <p className="text-sm text-center text-slate-400 mt-10 font-medium">Sin registros</p>}
                  {partnerContributions.map(contribution => (
                    <div key={contribution.id} className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-accent-50 transition-transform hover:-translate-y-1 group">
                      <span className="text-xs text-slate-400 font-bold">{formatDate(contribution.createdAt)}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-lg text-slate-700">S/ {contribution.amount}</span>
                        <button 
                          onClick={() => setContributionToDelete(contribution.id!)}
                          className="text-slate-300 hover:text-red-500 transition-colors p-1"
                          title="Eliminar aporte"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </CardContent>
      </Card>

      <ConfirmModal
        isOpen={showDeleteGoalModal}
        title="Eliminar Meta de Ahorro"
        message="¿Estás seguro de eliminar esta meta de ahorro por completo? Se perderá este registro y no podrá ser recuperado."
        confirmText="Sí, eliminar meta"
        onConfirm={handleDeleteGoal}
        onCancel={() => setShowDeleteGoalModal(false)}
      />

      <ConfirmModal
        isOpen={!!contributionToDelete}
        title="Eliminar Aporte"
        message="¿Estás seguro de eliminar este aporte? El monto será descontado del ahorro total."
        confirmText="Sí, eliminar aporte"
        onConfirm={handleDeleteContribution}
        onCancel={() => setContributionToDelete(null)}
      />
    </div>
  );
}
