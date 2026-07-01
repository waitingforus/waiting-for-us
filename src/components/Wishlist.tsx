import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Card, CardContent } from './ui/Card';
import { Sparkles, CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { wishlistConverter, type WishlistItem } from '../lib/types';

export function Wishlist({ username }: { username: string }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'wishlists').withConverter(wishlistConverter), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => doc.data()));
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    try {
      const wishlistRef = collection(db, 'wishlists').withConverter(wishlistConverter);
      addDoc(wishlistRef, {
        name: newItemName.trim(),
        isCompleted: false,
        createdBy: username,
        createdAt: serverTimestamp() as any,
      });
      setNewItemName('');
    } catch (error) {
      console.error("Error al añadir a wishlist:", error);
    }
  };

  const toggleStatus = (id: string, currentStatus: boolean) => {
    try {
      const itemRef = doc(db, 'wishlists', id);
      updateDoc(itemRef, {
        isCompleted: !currentStatus
      });
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  const handleDelete = (id: string) => {
    try {
      deleteDoc(doc(db, 'wishlists', id));
    } catch (error) {
      console.error("Error al eliminar item:", error);
    }
  };

  return (
    <Card className="bg-white border-0 shadow-sm flex flex-col h-full">
      <div className="bg-slate-50 border-b border-slate-100 p-4 sm:px-6">
        <h3 className="font-extrabold text-slate-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent-500" />
          Pequeños Deseos
        </h3>
      </div>
      <CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
        <form onSubmit={handleAdd} className="flex gap-2 mb-4">
          <input 
            type="text" 
            value={newItemName} 
            onChange={e => setNewItemName(e.target.value)}
            placeholder="Añadir deseo..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800"
          />
          <button type="submit" disabled={!newItemName.trim()} className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50 transition-colors hover:bg-slate-700">
            Añadir
          </button>
        </form>

        <div className="flex-1 overflow-y-auto pr-2 space-y-2 max-h-[300px]">
          {items.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">¿Qué les gustaría hacer juntos? (Cena, cine, viaje corto...)</p>
          ) : (
            items.map(item => (
              <div 
                key={item.id} 
                className={`group flex items-center gap-3 p-3 rounded-xl border transition-all ${item.isCompleted ? 'bg-slate-50/50 border-transparent opacity-60' : 'bg-white border-slate-100 shadow-sm hover:border-brand-200'}`}
              >
                <button onClick={() => toggleStatus(item.id!, item.isCompleted)} className="shrink-0 text-slate-400 hover:text-brand-500 transition-colors">
                  {item.isCompleted ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5" />}
                </button>
                <span className={`flex-1 text-sm font-medium ${item.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                  {item.name}
                </span>
                <button 
                  onClick={() => handleDelete(item.id!)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-all shrink-0"
                  title="Eliminar deseo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
