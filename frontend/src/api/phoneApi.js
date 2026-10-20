import axiosClient from './axiosClient';

export const phoneApi = {
  // Tìm kiếm sản phẩm qua endpoint có lỗ hổng SQL Injection
  searchVulnerable: (keyword = '') => {
    return axiosClient.get('/vulnerable/phones/search', {
      params: { keyword }
    });
  },

  // Tìm kiếm sản phẩm qua endpoint an toàn (Prepared Statements)
  searchSecure: (keyword = '') => {
    return axiosClient.get('/secure/phones/search', {
      params: { keyword }
    });
  }
};
