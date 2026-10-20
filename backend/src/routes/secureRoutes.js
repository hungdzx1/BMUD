const express = require('express');
const router = express.Router();
const secureController = require('../controllers/secureController');
const { requireAuth } = require('../middlewares/authMiddleware');

// Route đăng nhập an toàn sử dụng Prepared Statements
router.post('/login', secureController.login);

// Route tìm kiếm sản phẩm an toàn sử dụng Prepared Statements (yêu cầu đã đăng nhập)
router.get('/phones/search', requireAuth, secureController.searchPhones);

module.exports = router;
