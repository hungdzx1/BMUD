const app = require('./src/app');
const { testConnection, isDbConfigured } = require('./src/config/database');
const dotenv = require('dotenv');

dotenv.config();

const PORT = parseInt(process.env.PORT || '5000', 10);
// RÀNG BUỘC CHẶT CHẼ VÀO 127.0.0.1 (LOCALHOST) THEO YÊU CẦU BẢO VỆ PHÒNG LAB
const HOST = '127.0.0.1';

app.listen(PORT, HOST, async () => {
  console.log('===============================================================');
  console.log('🛡️  SQL INJECTION ATTACK & DEFENSE LAB - BACKEND SERVER RUNNING');
  console.log('===============================================================');
  console.log(`📍 Địa chỉ API: http://${HOST}:${PORT}`);
  console.log(`🧪 Lab Mode: ${process.env.LAB_MODE === 'true' ? 'BẬT (Cho phép kiểm thử Vulnerable)' : 'TẮT (Chỉ Secure)'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log('---------------------------------------------------------------');

  // Kiểm tra kết nối cơ sở dữ liệu Aiven
  if (!isDbConfigured()) {
    console.warn('⚠️  [CẢNH BÁO DATABASE]: Chưa cấu hình thông tin Aiven MySQL trong file backend/.env!');
    console.warn('👉  Vui lòng mở backend/.env và điền DB_HOST, DB_USER, DB_PASSWORD, DB_NAME.');
    console.warn('👉  Sau khi điền, chạy lệnh: npm run db:init để nạp Schema và Seed dữ liệu.');
  } else {
    console.log('📡 Đang kiểm tra kết nối đến Aiven MySQL...');
    const dbStatus = await testConnection();
    if (dbStatus.isConnected) {
      console.log(`✅ [DATABASE OK]: ${dbStatus.message}`);
    } else {
      console.error(`❌ [DATABASE ERROR]: ${dbStatus.message}`);
    }
  }
  console.log('===============================================================');
});
