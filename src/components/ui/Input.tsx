import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefixStr?: string;
  error?: string;
}

export function Input({ 
  label, 
  prefixStr, 
  error, 
  className = '', 
  id,
  ...props 
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-bold text-slate-600 mb-2 ml-2">
          {label}
        </label>
      )}
      <div className="relative flex items-center group">
        {prefixStr && (
          <span className="absolute left-5 text-slate-400 font-bold text-base transition-colors group-focus-within:text-brand-500">
            {prefixStr}
          </span>
        )}
        <input
          id={inputId}
          className={`w-full ${prefixStr ? 'pl-12' : 'px-5'} pr-5 py-3.5 bg-brand-50/50 border-2 border-brand-100 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-400/10 focus:bg-white transition-all text-slate-800 text-sm font-semibold placeholder-slate-400 ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-400/20 bg-red-50/50' : ''} disabled:opacity-60 disabled:bg-slate-50 disabled:cursor-not-allowed ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-2 ml-2 text-sm font-medium text-red-500">{error}</p>}
    </div>
  );
}
