const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Nạp file .env từ thư mục backend
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function initDatabase() {
  console.log('====================================================');
  console.log('🚀 Đang chuẩn bị khởi tạo Database cho Lab SQL Injection...');
  console.log('====================================================');

  if (!process.env.DB_HOST || !process.env.DB_USER) {
    console.error('❌ Lỗi: Chưa tìm thấy cấu hình kết nối database trong file .env');
    console.error('👉 Vui lòng mở backend/.env và điền DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT từ Aiven.');
    process.exit(1);
  }

  let sslConfig = undefined;
  if (process.env.DB_SSL_CA_PATH && fs.existsSync(process.env.DB_SSL_CA_PATH)) {
    sslConfig = {
      ca: fs.readFileSync(process.env.DB_SSL_CA_PATH),
      rejectUnauthorized: true
    };
  } else if (process.env.DB_HOST.includes('aivencloud.com') || process.env.DB_PORT != 3306) {
    sslConfig = { rejectUnauthorized: false };
  }

  const connectionConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sql_injection_demo',
    multipleStatements: true, // Chỉ bật khi chạy script khởi tạo schema & seed
    ssl: sslConfig
  };

  let connection;
  try {
    console.log(`📡 Đang kết nối đến MySQL: ${connectionConfig.host}:${connectionConfig.port}...`);
    connection = await mysql.createConnection(connectionConfig);
    console.log('✅ Kết nối MySQL thành công!');

    // 1. Chạy schema.sql
    const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log(`📄 Đang thực thi schema từ: ${schemaPath}`);
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await connection.query(schemaSql);
      console.log('✅ Khởi tạo Schema (bảng users, phones) thành công!');
    } else {
      console.warn(`⚠️ Không tìm thấy file schema tại: ${schemaPath}`);
    }

    // 2. Chạy seed.sql
    const seedPath = path.resolve(__dirname, '../../database/seed.sql');
    if (fs.existsSync(seedPath)) {
      console.log(`🌱 Đang nạp dữ liệu mẫu từ: ${seedPath}`);
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await connection.query(seedSql);
      console.log('✅ Nạp dữ liệu seed thành công (5 users, 10 phones)!');
    } else {
      console.warn(`⚠️ Không tìm thấy file seed tại: ${seedPath}`);
    }

    // Kiểm tra số lượng bản ghi
    const [userRows] = await connection.query('SELECT COUNT(*) as count FROM users');
    const [phoneRows] = await connection.query('SELECT COUNT(*) as count FROM phones');
    const [hiddenPhones] = await connection.query("SELECT COUNT(*) as count FROM phones WHERE status = 'off'");

    console.log('----------------------------------------------------');
    console.log(`🎉 TỔNG KẾT DỮ LIỆU LAB:`);
    console.log(`   - Số tài khoản users: ${userRows[0].count}`);
    console.log(`   - Số điện thoại: ${phoneRows[0].count} (Công khai: ${phoneRows[0].count - hiddenPhones[0].count}, Bị ẩn: ${hiddenPhones[0].count})`);
    console.log('----------------------------------------------------');
    console.log('✨ Sẵn sàng để thực hiện các bài demo SQL Injection Attack & Defense!');

  } catch (err) {
    console.error('❌ Lỗi khi khởi tạo database:', err.message);
    if (err.code === 'ECONNREFUSED') {
      console.error('👉 Không thể kết nối tới server MySQL. Hãy kiểm tra Host và Port.');
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('👉 Sai Username hoặc Password. Hãy kiểm tra lại tài khoản Aiven.');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.error(`👉 Database '${process.env.DB_NAME}' không tồn tại. Vui lòng tạo database trên Aiven trước.`);
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase();
