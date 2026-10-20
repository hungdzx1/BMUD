import React from 'react';
import { Smartphone } from 'lucide-react';

const PHONE_IMAGES = {
  'iPhone 15 Pro Max': '/images/phones/iphone-15-pro-max.jpg',
  'iPhone 14': '/images/phones/iphone-14.jpg',
  'Samsung Galaxy S24 Ultra': '/images/phones/samsung-galaxy-s24-ultra.jpg',
  'Samsung Galaxy A55': '/images/phones/samsung-galaxy-a55.jpg',
  'Xiaomi 14T Pro': '/images/phones/xiaomi-14t-pro.jpg',
  'OPPO Reno 12': '/images/phones/oppo-reno-12.jpg',
  'iPhone 16 Pro Max': '/images/phones/iphone-16-pro-max.jpg',
  'Samsung Galaxy Z Fold 6': '/images/phones/samsung-galaxy-z-fold-6.jpg',
  'Google Pixel 9 Pro': '/images/phones/google-pixel-9-pro.jpg',
  'Xiaomi MIX Fold 4': '/images/phones/xiaomi-mix-fold-4.jpg',
  'Xiaomi 14 Ultra': '/images/phones/xiaomi-14-ultra.jpg',
  'OPPO Find X7 Ultra': '/images/phones/oppo-find-x7-ultra.jpg',
  'Google Pixel 8 Pro': '/images/phones/google-pixel-8-pro.jpg',
  'iPhone 16 Pro Prototype': '/images/phones/iphone-16-pro-prototype.jpg',
  'Samsung Galaxy Z Fold 7 Secret Edition': '/images/phones/samsung-galaxy-z-fold-7-secret-edition.jpg',
  'Xiaomi MIX Fold 5 Prototype': '/images/phones/xiaomi-mix-fold-5-prototype.jpg',
  'Google Pixel 9 Ultra Concept': '/images/phones/google-pixel-9-ultra-concept.jpg',
};

export const PhoneCard = ({ phone }) => {
  const isHidden = phone.status === 'off';
  const imageUrl = phone.image || PHONE_IMAGES[phone.name];

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
        {/* KHU VỰC ẢNH SẢN PHẨM */}
        <div className="relative bg-slate-100 dark:bg-slate-900/60 overflow-hidden border-b border-slate-100 dark:border-slate-750 aspect-[4/3] flex items-center justify-center">
          {/* BADGE "ĐANG ẨN" CHO SẢN PHẨM STATUS = 'OFF' */}
          {isHidden && (
            <span className="absolute top-2.5 right-2.5 z-10 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-red-600 text-white shadow-md flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              Đang ẩn
            </span>
          )}

          {imageUrl ? (
            <img
              src={imageUrl}
              alt={phone.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-20 h-32 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 shadow-sm flex flex-col items-center justify-between p-1.5 group-hover:scale-105 transition-transform duration-200">
              <div className="w-5 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
              <div className="w-full flex-1 my-1 rounded-lg bg-gradient-to-b from-blue-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-800/80 flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-slate-400 dark:text-slate-500 opacity-60" />
              </div>
              <div className="w-6 h-0.5 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
            </div>
          )}
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
