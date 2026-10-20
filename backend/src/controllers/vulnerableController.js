const { getPool, isDbConfigured } = require('../config/database');

async function login(req, res) {
  const { username = '', password = '' } = req.body;

  // Kiểm tra cấu hình database
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
      message: 'Không thể khởi tạo kết nối cơ sở dữ liệu. Vui lòng kiểm tra lại cấu hình .env.',
      code: 'DB_POOL_ERROR'
    });
  }

  // CÂU LỆNH SQL NỐI CHUỖI TRỰC TIẾP (LỖ HỔNG CLASSIC SQL INJECTION)
  const rawSql = `SELECT id, username, password, role FROM users 
  WHERE username = '${username}' AND password = '${password}'`;

  try {
    const [rows] = await pool.query(rawSql);

    if (rows && rows.length > 0) {
      const user = rows[0];

      const isActualPasswordMatch = user.password === password;
      const hasSqlCharacters = /['";\-#\/\*]/i.test(username) || /['";\-#\/\*]/i.test(password);
      const isBypassedByInjection = !isActualPasswordMatch || hasSqlCharacters;

      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role,
        isDemoInjection: isBypassedByInjection,
        loginMode: 'vulnerable'
      };

      return res.status(200).json({
        success: true,
        message: isBypassedByInjection
          ? 'ĐĂNG NHẬP THÀNH CÔNG NHỜ SQL INJECTION: Bạn đã vượt qua cơ chế xác thực mà không cần mật khẩu chính xác!'
          : 'Đăng nhập thành công bằng tài khoản mẫu hợp lệ.',
        isDemoInjection: isBypassedByInjection,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    }

    // Không tìm thấy bản ghi phù hợp
    return res.status(401).json({
      success: false,
      message: 'Đăng nhập thất bại: Tên đăng nhập hoặc mật khẩu không chính xác.'
    });

  } catch (error) {
    console.error('[Vulnerable Login Error]', error.message);

    return res.status(400).json({
      success: false,
      message: `Lỗi thực thi SQL: ${error.sqlMessage || error.message}`,
      code: error.code || 'SQL_SYNTAX_ERROR'
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

  // CÂU LỆNH SQL NỐI CHUỖI CÓ LỖ HỔNG
  // Thông thường: chỉ hiển thị các sản phẩm công khai có status = 'on'
  const rawSql = `SELECT * FROM phones 
  WHERE status = 'on' AND name LIKE '%${keyword}%'`;

  try {
    const [rows] = await pool.query(rawSql);

    const hiddenItems = rows.filter(phone => phone.status === 'off');
    const hasExposedHidden = hiddenItems.length > 0;
    const exposedHiddenCount = hiddenItems.length;

    return res.status(200).json({
      success: true,
      data: rows,
      total: rows.length,
      hasExposedHidden,
      exposedHiddenCount
    });

  } catch (error) {
    console.error('[Vulnerable Search Error]', error.message);

    return res.status(400).json({
      success: false,
      message: `Lỗi truy vấn SQL: ${error.sqlMessage || error.message}`,
      code: error.code || 'SQL_SYNTAX_ERROR'
    });
  }
}

module.exports = {
  login,
  searchPhones
};
