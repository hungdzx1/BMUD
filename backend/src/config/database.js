const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

let pool = null;
let connectionStatus = {
  isConnected: false,
  message: 'Chưa khởi tạo kết nối cơ sở dữ liệu',
  lastChecked: null
};

/**
 * Kiểm tra xem các biến môi trường bắt buộc của database đã được cung cấp hay chưa
 */
function isDbConfigured() {
  return Boolean(
    process.env.DB_HOST &&
    process.env.DB_HOST.trim() !== '' &&
    process.env.DB_USER &&
    process.env.DB_USER.trim() !== ''
  );
}

/**
 * Thiết lập cấu hình SSL/TLS cho Aiven MySQL
 */
function getSslConfig() {
  const caPath = process.env.DB_SSL_CA_PATH;
  
  if (caPath) {
    const resolvedPath = path.isAbsolute(caPath) ? caPath : path.resolve(process.cwd(), caPath);
    if (fs.existsSync(resolvedPath)) {
      try {
        return {
          ca: fs.readFileSync(resolvedPath),
          rejectUnauthorized: true
        };
      } catch (err) {
        console.warn(`[Database Warning] Không thể đọc file CA tại: ${resolvedPath}. Sẽ sử dụng rejectUnauthorized: false`);
      }
    }
  }

  // Nếu kết nối đến Aiven hoặc host từ xa yêu cầu SSL nhưng chưa có file CA cục bộ
  const host = process.env.DB_HOST || '';
  if (host.includes('aivencloud.com') || host.includes('aiven') || process.env.DB_SSL === 'true') {
    return {
      rejectUnauthorized: false
    };
  }

  return undefined;
}

/**
 * Khởi tạo Connection Pool
 */
function getPool() {
  if (pool) return pool;

  if (!isDbConfigured()) {
    connectionStatus = {
      isConnected: false,
      message: 'Thiếu cấu hình kết nối Aiven MySQL trong file .env (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME).',
      lastChecked: new Date()
    };
    return null;
  }

  try {
    const sslConfig = getSslConfig();

    const poolConfig = {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'sql_injection_demo',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      // Bảo mật lab: không cho phép multipleStatements để tránh rủi ro phá hủy DB ngoài bài lab
      multipleStatements: false,
      connectTimeout: 10000
    };

    if (sslConfig) {
      poolConfig.ssl = sslConfig;
    }

    pool = mysql.createPool(poolConfig);
    return pool;
  } catch (error) {
    connectionStatus = {
      isConnected: false,
      message: `Khởi tạo pool thất bại: ${error.message}`,
      lastChecked: new Date()
    };
    return null;
  }
}

/**
 * Hàm kiểm tra kết nối thực tế tới MySQL
 */
async function testConnection() {
  if (!isDbConfigured()) {
    connectionStatus = {
      isConnected: false,
      message: 'Chưa cấu hình thông số kết nối Database trong file .env. Vui lòng cập nhật DB_HOST, DB_USER, DB_PASSWORD từ Aiven.',
      lastChecked: new Date()
    };
    return connectionStatus;
  }

  try {
    const activePool = getPool();
    if (!activePool) {
      return connectionStatus;
    }

    const connection = await activePool.getConnection();
    await connection.ping();
    connection.release();

    connectionStatus = {
      isConnected: true,
      message: `Đã kết nối thành công đến MySQL database: ${process.env.DB_NAME} tại ${process.env.DB_HOST}`,
      lastChecked: new Date()
    };
    return connectionStatus;
  } catch (error) {
    connectionStatus = {
      isConnected: false,
      message: `Không thể kết nối đến MySQL: ${error.message}. Vui lòng kiểm tra lại thông tin Aiven host, port, user, password và cấu hình SSL.`,
      lastChecked: new Date()
    };
    return connectionStatus;
  }
}

function getConnectionStatus() {
  return connectionStatus;
}

module.exports = {
  getPool,
  isDbConfigured,
  testConnection,
  getConnectionStatus
};
