import React from 'react';

export function Card({ children, className = '', onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) {
  return (
    <div onClick={onClick} className={`bg-white rounded-2xl shadow-xl shadow-brand-900/5 border border-brand-50 overflow-hidden transition-transform duration-300 hover:shadow-2xl hover:shadow-brand-900/10 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`p-8 pb-0 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <h3 className={`text-xl font-bold text-slate-800 ${className}`}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`p-8 ${className}`}>
      {children}
    </div>
  );
}
