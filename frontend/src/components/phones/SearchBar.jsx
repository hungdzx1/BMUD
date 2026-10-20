import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({ onSearch, loading }) => {
  const [keyword, setKeyword] = useState('');

  // Nút 1: Tìm kiếm mẫu
  const handleUseSampleSearch = () => {
    setKeyword('iPhone');
    onSearch('iPhone');
  };

  // Nút 2: Điền mẫu SQLi
  const handleUseSqlInjection = () => {
    const injectionPayload = "%' OR '1'='1' -- ";
    setKeyword(injectionPayload);
    onSearch(injectionPayload);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(keyword);
  };

  const handleClear = () => {
    setKeyword('');
    onSearch('');
  };

  return (
    <div className="space-y-3">
      {/* THANH TÌM KIẾM CHÍNH */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm kiếm điện thoại..."
            className="w-full pl-9 pr-9 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
          />
          {keyword && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded-lg font-medium text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer ${
            loading ? 'opacity-70 cursor-wait' : ''
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Tìm kiếm</span>
        </button>
      </form>

      {/* CÁC NÚT TÁC VỤ PHỤ */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleUseSampleSearch}
          className="py-1 px-2.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors"
        >
          Tìm kiếm mẫu
        </button>

        <button
          type="button"
          onClick={handleUseSqlInjection}
          className="py-1 px-2.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors"
        >
          Điền mẫu SQLi
        </button>
      </div>
    </div>
  );
};
