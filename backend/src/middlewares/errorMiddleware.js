/**
 * Middleware xử lý lỗi tập trung và bảo mật thông tin máy chủ
 */
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Không tìm thấy endpoint: ${req.method} ${req.originalUrl}`,
    code: 'NOT_FOUND'
  });
}

function errorHandler(err, req, res, next) {
  console.error('[Error Handler]', err);

  // Xử lý lỗi kết nối cơ sở dữ liệu
  if (err.code === 'ECONNREFUSED' || err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ER_ACCESS_DENIED_ERROR') {
    return res.status(503).json({
      success: false,
      message: 'Không thể kết nối đến cơ sở dữ liệu MySQL (Aiven). Vui lòng kiểm tra lại cấu hình DB trong file .env.',
      code: 'DB_CONNECTION_ERROR'
    });
  }

  // Lỗi cú pháp SQL (khi SQL Injection gây lỗi cú pháp)
  
  if (err.code && err.code.startsWith('ER_')) {
    return res.status(400).json({
      success: false,
      message: `Lỗi truy vấn cơ sở dữ liệu: ${err.sqlMessage || err.message}`,
      code: err.code,
      queryError: true
    });
  }

  // Lỗi máy chủ thông thường (không làm lộ stack trace ra ngoài)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Đã có lỗi nội bộ xảy ra trên máy chủ.',
    code: err.code || 'INTERNAL_SERVER_ERROR'
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
