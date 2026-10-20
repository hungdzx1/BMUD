/**
 * Middleware kiểm tra phiên đăng nhập người dùng (Session Auth Guard)
 */
function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }

  return res.status(401).json({
    success: false,
    message: 'Phiên đăng nhập không tồn tại hoặc đã hết hạn. Vui lòng đăng nhập lại.',
    code: 'UNAUTHORIZED'
  });
}

module.exports = {
  requireAuth
};
