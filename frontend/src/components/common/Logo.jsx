import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone } from 'lucide-react';

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 group transition-opacity hover:opacity-90">
      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
        <Smartphone className="w-4 h-4" />
      </div>
      <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
        Phone<span className="text-blue-600 dark:text-blue-500">Store</span>
      </span>
    </Link>
  );
};
