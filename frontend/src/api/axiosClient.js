import axios from 'axios';

// Cấu hình Axios Client giao tiếp với Express Backend
const axiosClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Cho phép lưu trữ và truyền Cookie session
  timeout: 10000,
});

// Xử lý phản hồi từ server
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Trả về dữ liệu lỗi chi tiết nếu server phản hồi
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject({
      success: false,
      message: error.message || 'Không thể kết nối tới máy chủ Express Backend.'
    });
  }
);

export default axiosClient;
