/**
 * Service tiện ích cho xác thực và quản lý tài khoản người dùng
 */

/**
 * Loại bỏ trường password và các thông tin nhạy cảm trước khi trả về client
 */
function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

module.exports = {
  sanitizeUser
};
