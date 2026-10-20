const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/authMiddleware');
const { testConnection, isDbConfigured } = require('../config/database');

/**
 * Lấy thông tin phiên đăng nhập hiện tại
 */
router.get('/me', requireAuth, (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.session.user
  });
});

/**
 * Đăng xuất tài khoản và hủy session
 */
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('[Logout Error]', err);
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi hủy phiên làm việc.'
      });
    }

    res.clearCookie('connect.sid');
    return res.status(200).json({
      success: true,
      message: 'Đăng xuất thành công. Đã hủy phiên làm việc.'
    });
  });
});

/**
 * Kiểm tra trạng thái kết nối cơ sở dữ liệu (TC14)
 */
router.get('/db-status', async (req, res) => {
  const isConfigured = isDbConfigured();
  if (!isConfigured) {
    return res.status(200).json({
      configured: false,
      connected: false,
      message: 'Chưa cấu hình thông số kết nối Aiven MySQL trong file backend/.env (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME).'
    });
  }

  const status = await testConnection();
  return res.status(200).json({
    configured: true,
    connected: status.isConnected,
    message: status.message,
    host: process.env.DB_HOST || '',
    database: process.env.DB_NAME || ''
  });
});

module.exports = router;
