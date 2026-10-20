import React from 'react';
import { PhoneCard } from './PhoneCard';

export const PhoneGrid = ({ phones = [], loading = false }) => {
  // SKELETON LOADING
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 animate-pulse space-y-3">
            <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-700/50 rounded-lg"></div>
            <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-5 w-1/2 bg-slate-200 dark:bg-slate-700 rounded pt-2"></div>
          </div>
        ))}
      </div>
    );
  }

  // EMPTY STATE
  if (!phones || phones.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Không tìm thấy sản phẩm nào
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {phones.map((phone) => (
        <PhoneCard key={phone.id} phone={phone} />
      ))}
    </div>
  );
};
