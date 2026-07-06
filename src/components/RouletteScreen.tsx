import React, { useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { CoupleSettings } from '../lib/types';
import { Plus, Trash2, Utensils, PartyPopper } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';

interface RouletteScreenProps {
  settings: CoupleSettings | null;
}

const backgroundColors = ['#FBBF24', '#F87171', '#34D399', '#60A5FA', '#A78BFA', '#F472B6'];

export function RouletteScreen({ settings }: RouletteScreenProps) {
  const [newFood, setNewFood] = useState('');
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);

  const foodOptions = settings?.foodOptions || [];
  // Ensure we have at least 2 options for the wheel to render properly, or placeholder
  const wheelData = foodOptions.length > 0 
    ? foodOptions.map((option, i) => ({ 
        option, 
        style: { backgroundColor: backgroundColors[i % backgroundColors.length], textColor: 'white' } 
      }))
    : [{ option: 'Agrega comidas', style: { backgroundColor: '#cbd5e1', textColor: 'white' } }];

  const handleAddFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFood.trim() || !settings?.id) return;
    
    const updatedOptions = [...foodOptions, newFood.trim()];
    try {
      await updateDoc(doc(db, 'settings', 'couple'), {
        foodOptions: updatedOptions
      });
      setNewFood('');
    } catch (error) {
      console.error("Error adding food:", error);
    }
  };

  const handleRemoveFood = async (index: number) => {
    if (!settings?.id) return;
    
    const updatedOptions = [...foodOptions];
    updatedOptions.splice(index, 1);
    
    try {
      await updateDoc(doc(db, 'settings', 'couple'), {
        foodOptions: updatedOptions
      });
    } catch (error) {
      console.error("Error removing food:", error);
    }
  };

  const handleSpinClick = () => {
    if (!mustSpin && foodOptions.length > 0) {
      setWinner(null);
      const newPrizeNumber = Math.floor(Math.random() * foodOptions.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 pb-12 animate-fade-in mt-32">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-slate-800 drop-shadow-sm flex items-center justify-center gap-3">
          <Utensils className="w-10 h-10 text-brand-500" />
          La Ruleta de Comida
        </h2>
        <p className="text-slate-600 mt-2 text-lg">¿No saben qué cenar hoy? ¡Dejen que el destino decida!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Lado Izquierdo: La Lista */}
        <Card className="bg-white/80 backdrop-blur-md shadow-xl border-brand-100/50">
          <CardHeader>
            <CardTitle className="text-2xl text-brand-700 flex items-center gap-2">
              Opciones del Menú
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleAddFood} className="flex gap-2">
              <input
                type="text"
                value={newFood}
                onChange={(e) => setNewFood(e.target.value)}
                placeholder="Ej. Chifa, Pizza, Ensalada..."
                className="flex-1 rounded-xl border-slate-200 bg-white/50 px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:ring-brand-500 shadow-sm transition-all"
              />
              <Button type="submit" disabled={!newFood.trim()} className="bg-brand-500 hover:bg-brand-600 text-white rounded-xl px-6 shadow-md shadow-brand-500/20">
                <Plus className="w-5 h-5" />
              </Button>
            </form>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {foodOptions.length === 0 ? (
                <div className="text-center py-10 text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  <p>Aún no hay opciones.</p>
                  <p className="text-sm">Agreguen algunas comidas arriba.</p>
                </div>
              ) : (
                foodOptions.map((food, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-brand-200 transition-colors group">
                    <span className="font-medium text-slate-700 text-lg">{food}</span>
                    <button
                      onClick={() => handleRemoveFood(idx)}
                      className="text-slate-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Eliminar opción"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lado Derecho: La Ruleta */}
        <div className="flex flex-col items-center justify-center space-y-8 bg-white/40 p-8 rounded-3xl border border-white/60 shadow-inner relative">
          
          <div className="relative">
            <div className="absolute inset-0 bg-brand-500 blur-3xl opacity-10 rounded-full scale-110"></div>
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={prizeNumber}
              data={wheelData}
              onStopSpinning={() => {
                setMustSpin(false);
                if (foodOptions.length > 0) {
                  setWinner(foodOptions[prizeNumber]);
                }
              }}
              backgroundColors={backgroundColors}
              textColors={['#ffffff']}
              outerBorderColor="#ffffff"
              outerBorderWidth={5}
              innerRadius={20}
              innerBorderColor="#ffffff"
              innerBorderWidth={2}
              radiusLineColor="#ffffff"
              radiusLineWidth={2}
              fontSize={20}
            />
          </div>

          <Button 
            onClick={handleSpinClick} 
            disabled={mustSpin || foodOptions.length === 0}
            className="w-full max-w-xs text-xl py-6 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 text-white shadow-xl shadow-brand-500/30 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 font-bold tracking-wide"
          >
            {mustSpin ? 'Girando...' : '¡Girar Ruleta!'}
          </Button>

          {/* Resultado */}
          {winner && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-fade-in w-full px-4">
              <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border-2 border-brand-400 text-center flex flex-col items-center max-w-md mx-auto">
                <PartyPopper className="w-16 h-16 text-accent-500 mb-4 animate-bounce" />
                <h3 className="text-2xl font-bold text-slate-500 mb-2">¡Hoy toca cenar!</h3>
                <p className="text-5xl font-extrabold bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent mb-8">
                  {winner}
                </p>
                <Button 
                  onClick={() => setWinner(null)}
                  className="w-full rounded-xl text-lg"
                >
                  ¡Entendido!
                </Button>
              </div>
            </div>
          )}

          {winner && (
            <div 
              className="fixed -inset-10 bg-slate-900/40 backdrop-blur-sm z-40 animate-fade-in rounded-3xl"
              onClick={() => setWinner(null)}
            />
          )}

        </div>
      </div>
    </div>
  );
}
