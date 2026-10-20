/**
 * Middleware đảm bảo các endpoint chứa lỗ hổng (Vulnerable)
 * chỉ được phép truy cập trong môi trường Lab cục bộ (localhost)
 */
function labOnly(req, res, next) {
  const isLabMode = process.env.LAB_MODE === 'true';

  // Kiểm tra biến môi trường LAB_MODE
  if (!isLabMode) {
    return res.status(403).json({
      success: false,
      message: 'Truy cập bị từ chối: Các endpoint Vulnerable bị vô hiệu hóa vì LAB_MODE không bật.',
      code: 'LAB_MODE_DISABLED'
    });
  }

  // Kiểm tra địa chỉ IP để đảm bảo chỉ chạy trên localhost
  const clientIp = req.ip || req.connection.remoteAddress || '';
  const isLocal = clientIp === '127.0.0.1' || clientIp === '::1' || clientIp === '::ffff:127.0.0.1';

  if (!isLocal) {
    return res.status(403).json({
      success: false,
      message: 'Cảnh báo bảo mật: Chỉ cho phép truy cập các endpoint thử nghiệm lỗ hổng từ localhost (127.0.0.1).',
      code: 'LOCAL_ONLY'
    });
  }

  next();
}

module.exports = {
  labOnly
};
