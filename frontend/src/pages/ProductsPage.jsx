import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { phoneApi } from '../api/phoneApi';
import { Logo } from '../components/common/Logo';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { SecurityTabs } from '../components/common/SecurityTabs';
import { SearchBar } from '../components/phones/SearchBar';
import { PhoneGrid } from '../components/phones/PhoneGrid';
import { LogOut, User } from 'lucide-react';

export const ProductsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeMode, setActiveMode] = useState('vulnerable');
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(false);

  // Tải danh sách điện thoại
  const loadPhones = useCallback(async (mode, searchKeyword = '') => {
    setLoading(true);
    try {
      let res;
      if (mode === 'vulnerable') {
        res = await phoneApi.searchVulnerable(searchKeyword);
      } else {
        res = await phoneApi.searchSecure(searchKeyword);
      }

      if (res && res.success) {
        setPhones(res.data || []);
      }
    } catch (err) {
      setPhones([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Tải danh sách sản phẩm công khai ban đầu khi vào trang
  useEffect(() => {
    loadPhones(activeMode, '');
  }, [activeMode, loadPhones]);

  // Chuyển tab Vulnerable <-> Secure
  const handleModeChange = (newMode) => {
    setActiveMode(newMode);
    loadPhones(newMode, '');
  };

  // Tìm kiếm
  const handleSearch = (keyword) => {
    loadPhones(activeMode, keyword);
  };

  // Đăng xuất
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      {/* HEADER BÁN HÀNG */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* LOGO & MENU */}
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
              <Link to="/products" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                Trang chủ
              </Link>
              <Link to="/products" className="text-blue-600 dark:text-blue-400 font-semibold">
                Điện thoại
              </Link>
            </nav>
          </div>

          {/* USER INFO & ACTIONS */}
          <div className="flex items-center gap-3">
            {/* TÊN TÀI KHOẢN ĐANG ĐĂNG NHẬP */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium">{user?.username || 'User'}</span>
            </div>

            <ThemeToggle />

            {/* NÚT ĐĂNG XUẤT */}
            <button
              onClick={handleLogout}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-750 text-xs font-medium transition-colors cursor-pointer shadow-sm"
              title="Đăng xuất"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      {/* NỘI DUNG TRANG */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* TIÊU ĐỀ TRANG */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Điện thoại
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Khám phá các sản phẩm mới nhất
            </p>
          </div>

          {/* SEARCH BAR */}
          <div className="w-full sm:w-80">
            <SearchBar onSearch={handleSearch} loading={loading} />
          </div>
        </div>

        {/* SECURITY TABS */}
        <SecurityTabs activeMode={activeMode} onChangeMode={handleModeChange} disabled={loading} />

        {/* DANH SÁCH SẢN PHẨM */}
        <PhoneGrid phones={phones} loading={loading} />
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 mt-12 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 PhoneStore. Cửa hàng điện thoại chính hãng.</p>
        </div>
      </footer>
    </div>
  );
};
