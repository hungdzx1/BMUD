import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export const LoginForm = ({ activeMode }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Nút 1: Tài khoản mẫu
  const handleUseSampleAccount = () => {
    setUsername('admin');
    setPassword('admin123');
    setAlert({
      type: 'info',
      message: 'Đã điền tài khoản mẫu (admin / admin123)'
    });
  };

  // Nút 2: Điền mẫu SQLi
  const handleUseSqlInjection = () => {
    setUsername("admin' OR '1' = '1' -- ");
    setPassword('any_password');
    setAlert({
      type: 'info',
      message: "Đã điền mẫu SQL Injection (admin' OR '1' = '1' -- )"
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setAlert({ type: 'error', message: 'Vui lòng nhập tên đăng nhập' });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const response = await login(activeMode, username, password);

      setAlert({
        type: 'success',
        message: 'Đăng nhập thành công'
      });

      setTimeout(() => {
        navigate('/products');
      }, 600);

    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Tên đăng nhập hoặc mật khẩu không đúng'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* USERNAME */}
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Tên đăng nhập
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nhập username"
          className="w-full px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
        />
      </div>

      {/* PASSWORD */}
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Mật khẩu
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
            className="w-full pl-3 pr-10 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* THÔNG BÁO NGẮN GỌN */}
      {alert && (
        <div className={`p-2.5 rounded-lg text-xs font-medium ${
          alert.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
            : alert.type === 'error'
            ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
            : 'bg-slate-100 dark:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
        }`}>
          {alert.message}
        </div>
      )}

      {/* NÚT ĐĂNG NHẬP */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm cursor-pointer ${
          loading ? 'opacity-70 cursor-wait' : ''
        }`}
      >
        {loading ? 'Đang xác thực...' : 'Đăng nhập'}
      </button>

      {/* HAI NÚT PHỤ TIỆN LỢI */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleUseSampleAccount}
          className="flex-1 py-1.5 px-2 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors text-center"
        >
          Tài khoản mẫu
        </button>

        <button
          type="button"
          onClick={handleUseSqlInjection}
          className="flex-1 py-1.5 px-2 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors text-center"
        >
          Điền mẫu SQLi
        </button>
      </div>
    </form>
  );
};
