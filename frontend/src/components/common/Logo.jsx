import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.png';

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2.5 group transition-opacity hover:opacity-90">
      <img
        src={logoImg}
        alt="PhoneStore Logo"
        className="w-8 h-8 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform"
      />
      <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
        Phone<span className="text-blue-600 dark:text-blue-500">Store</span>
      </span>
    </Link>
  );
};
