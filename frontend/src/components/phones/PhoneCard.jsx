import React from 'react';
import { Smartphone } from 'lucide-react';

export const PhoneCard = ({ phone }) => {
  const isHidden = phone.status === 'off';

  // Định dạng tiền tệ VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all flex flex-col justify-between h-full group">
      <div>
        {/* KHU VỰC ẢNH ĐIỆN THOẠI (SMARTPHONE MOCKUP PLACEHOLDER) */}
        <div className="relative bg-slate-50 dark:bg-slate-900/50 p-6 flex items-center justify-center border-b border-slate-100 dark:border-slate-750 aspect-[4/3]">
          {/* BADGE "ĐANG ẨN" CHO SẢN PHẨM STATUS = 'OFF' */}
          {isHidden && (
            <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50">
              Đang ẩn
            </span>
          )}

          {/* HÌNH ẢNH MÔ PHỎNG ĐIỆN THOẠI TINH TẾ */}
          <div className="w-20 h-32 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 shadow-sm flex flex-col items-center justify-between p-1.5 group-hover:scale-105 transition-transform duration-200">
            {/* LOA THOẠI / DYNAMIC ISLAND */}
            <div className="w-5 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
            {/* MÀN HÌNH */}
            <div className="w-full flex-1 my-1 rounded-lg bg-gradient-to-b from-blue-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-800/80 flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-slate-400 dark:text-slate-500 opacity-60" />
            </div>
            {/* PHÍM ĐÁY */}
            <div className="w-6 h-0.5 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
          </div>
        </div>

        {/* THÔNG TIN CHI TIẾT */}
        <div className="p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {phone.brand}
            </span>
            {phone.storage && (
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {phone.storage}
              </span>
            )}
          </div>

          <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" title={phone.name}>
            {phone.name}
          </h3>

          {phone.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {phone.description}
            </p>
          )}
        </div>
      </div>

      {/* GIÁ TIỀN & THÔNG SỐ PHỤ */}
      <div className="p-4 pt-0">
        <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-baseline justify-between">
          <span className="text-base font-bold text-blue-600 dark:text-blue-400">
            {formatPrice(phone.price)}
          </span>
          {phone.color && (
            <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[100px]">
              {phone.color}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
