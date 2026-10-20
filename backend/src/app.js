const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const vulnerableRoutes = require('./routes/vulnerableRoutes');
const secureRoutes = require('./routes/secureRoutes');
const { notFoundHandler, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

// 1. Bảo mật HTTP Headers cơ bản với Helmet
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);

// 2. Cấu hình CORS để giao tiếp an toàn với Frontend React
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: frontendUrl,
    credentials: true, // Cho phép truyền cookie session giữa React và Express
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

// 3. Phân tích cú pháp request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Cấu hình Quản lý phiên làm việc (Session Management)
app.use(
  session({
    name: 'sqli_lab_session',
    secret: process.env.SESSION_SECRET || 'sqli_defense_demo_secret_2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Sử dụng HTTP trong môi trường lab localhost
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 giờ
    }
  })
);

// 5. Route kiểm tra trạng thái máy chủ
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    labMode: process.env.LAB_MODE === 'true',
    timestamp: new Date()
  });
});

// 6. Gắn kết các API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vulnerable', vulnerableRoutes);
app.use('/api/secure', secureRoutes);

// 7. Xử lý lỗi 404 và Global Error Handler
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
