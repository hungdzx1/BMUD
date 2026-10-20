const { getPool, isDbConfigured } = require('../config/database');

async function login(req, res) {
  const { username = '', password = '' } = req.body;

  if (!isDbConfigured()) {
    return res.status(503).json({
      success: false,
      message: 'Cơ sở dữ liệu chưa được cấu hình. Vui lòng cập nhật thông tin Aiven MySQL trong file .env.',
      code: 'DB_NOT_CONFIGURED'
    });
  }

  const pool = getPool();
  if (!pool) {
    return res.status(503).json({
      success: false,
      message: 'Không thể kết nối cơ sở dữ liệu. Vui lòng kiểm tra lại cấu hình .env.',
      code: 'DB_POOL_ERROR'
    });
  }

  // TRUY VẤN AN TOÀN SỬ DỤNG PLACEHOLDERS (?)
  const preparedSql = 'SELECT id, username, role FROM users WHERE username = ? AND password = ?';
  const queryParams = [username, password];

  try {
    
    const [rows] = await pool.execute(preparedSql, queryParams);

    if (rows && rows.length > 0) {
      const user = rows[0];


      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role,
        isDemoInjection: false,
        loginMode: 'secure'
      };

      return res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công với cơ chế bảo vệ Prepared Statements.',
        isDemoInjection: false,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    }

 
    return res.status(401).json({
      success: false,
      message: 'Đăng nhập thất bại: Tên đăng nhập hoặc mật khẩu không chính xác.'
    });

  } catch (error) {
    console.error('[Secure Login Error]', error.message);

    return res.status(500).json({
      success: false,
      message: `Lỗi truy vấn cơ sở dữ liệu: ${error.message}`,
      code: error.code || 'DB_ERROR'
    });
  }
}

async function searchPhones(req, res) {
  const keyword = req.query.keyword !== undefined ? String(req.query.keyword) : '';

  if (!isDbConfigured()) {
    return res.status(503).json({
      success: false,
      message: 'Cơ sở dữ liệu chưa được cấu hình. Vui lòng cập nhật file .env.',
      code: 'DB_NOT_CONFIGURED'
    });
  }

  const pool = getPool();
  if (!pool) {
    return res.status(503).json({
      success: false,
      message: 'Không thể kết nối cơ sở dữ liệu.',
      code: 'DB_POOL_ERROR'
    });
  }

  // TRUY VẤN AN TOÀN VỚI THAM SỐ HÓA
  const preparedSql = "SELECT * FROM phones WHERE status = 'on' AND name LIKE ?";
  const searchPattern = `%${keyword}%`;
  const queryParams = [searchPattern];

  try {
    const [rows] = await pool.execute(preparedSql, queryParams);

    // Rà soát đảm bảo không bao giờ có sản phẩm status = 'off'
    const hiddenItems = rows.filter(phone => phone.status === 'off');
    const hasExposedHidden = hiddenItems.length > 0; // Luôn luôn là false trong Secure mode

    return res.status(200).json({
      success: true,
      data: rows,
      total: rows.length,
      hasExposedHidden,
      exposedHiddenCount: 0
    });

  } catch (error) {
    console.error('[Secure Search Error]', error.message);

    return res.status(500).json({
      success: false,
      message: `Lỗi thực thi tìm kiếm: ${error.message}`,
      code: error.code || 'DB_ERROR'
    });
  }
}

module.exports = {
  login,
  searchPhones
};
