import React, { useState } from 'react';
import { Logo } from '../components/common/Logo';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { SecurityTabs } from '../components/common/SecurityTabs';
import { LoginForm } from '../components/auth/LoginForm';

export const LoginPage = () => {
  const [activeMode, setActiveMode] = useState('vulnerable');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      {/* HEADER */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
      </header>

      {/* MAIN CONTENT - FORM ĐĂNG NHẬP CĂN GIỮA */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-[420px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 sm:p-8 shadow-sm">
          {/* TIÊU ĐỀ */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Đăng nhập
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Chào mừng bạn quay trở lại
            </p>
          </div>

          {/* SECURITY TABS */}
          <SecurityTabs activeMode={activeMode} onChangeMode={setActiveMode} />

          {/* FORM */}
          <LoginForm activeMode={activeMode} />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto px-4">
          <p>© 2026 PhoneStore. Cửa hàng điện thoại chính hãng.</p>
        </div>
      </footer>
    </div>
  );
};
