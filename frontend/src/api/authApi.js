import axiosClient from './axiosClient';

export const authApi = {
  // Đăng nhập qua endpoint có lỗ hổng SQL Injection
  loginVulnerable: (username, password) => {
    return axiosClient.post('/vulnerable/login', { username, password });
  },

  // Đăng nhập qua endpoint an toàn (Prepared Statements)
  loginSecure: (username, password) => {
    return axiosClient.post('/secure/login', { username, password });
  },

  // Kiểm tra phiên làm việc hiện tại
  getMe: () => {
    return axiosClient.get('/auth/me');
  },

  // Đăng xuất và hủy phiên
  logout: () => {
    return axiosClient.post('/auth/logout');
  },

  // Kiểm tra trạng thái cấu hình và kết nối cơ sở dữ liệu Aiven
  getDbStatus: () => {
    return axiosClient.get('/auth/db-status');
  }
};
