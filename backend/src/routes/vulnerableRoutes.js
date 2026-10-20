const express = require('express');
const router = express.Router();
const vulnerableController = require('../controllers/vulnerableController');
const { requireAuth } = require('../middlewares/authMiddleware');
const { labOnly } = require('../middlewares/labOnlyMiddleware');

// Tất cả các route vulnerable đều được bảo vệ bởi labOnly middleware
router.use(labOnly);

// Route đăng nhập có lỗ hổng SQL Injection
router.post('/login', vulnerableController.login);

// Route tìm kiếm sản phẩm có lỗ hổng SQL Injection (yêu cầu đã đăng nhập)
router.get('/phones/search', requireAuth, vulnerableController.searchPhones);

module.exports = router;
