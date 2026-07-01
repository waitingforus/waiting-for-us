import React from 'react';

export function SkeletonDashboard() {
  return (
    <div className="min-h-screen w-full bg-[#F8FAFC]">
      {/* Header Skeleton */}
      <div className="w-full h-24 bg-slate-200/60 animate-pulse"></div>
      
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 mt-12">
        {/* Action Bar Skeleton */}
        <div className="flex justify-between items-center mb-10">
          <div className="h-8 w-48 bg-slate-200/60 rounded-full animate-pulse"></div>
          <div className="h-10 w-36 bg-slate-200/60 rounded-xl animate-pulse"></div>
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-48">
              <div>
                <div className="h-6 w-1/2 bg-slate-200/60 rounded-full mb-4 animate-pulse"></div>
                <div className="h-10 w-3/4 bg-slate-200/60 rounded-full animate-pulse"></div>
              </div>
              <div className="h-4 w-full bg-slate-100 rounded-full mt-6 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
