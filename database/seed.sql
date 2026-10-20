-- ==========================================================
-- SQL Injection Attack & Defense Lab Seed Data
-- 5 Tài khoản mẫu (admin, manager, demo, 2 người dùng thường)
-- 10 Sản phẩm điện thoại (6 'on' công khai, 4 'off' nội bộ/ẩn)
-- ==========================================================

-- 1. Seed bảng users
-- Mật khẩu dạng thuần để minh họa trực quan truy vấn SQL Injection trong môi trường Lab
INSERT INTO users (username, password, role) VALUES
('admin', 'admin123', 'admin'),
('manager', 'manager123', 'admin'),
('demo', 'demo123', 'user'),
('john_doe', 'password123', 'user'),
('alice_smith', 'alice2026', 'user');

-- 2. Seed bảng phones
-- 6 sản phẩm ON (công khai hiển thị)
-- 4 sản phẩm OFF (bị ẩn, mẫu thử nghiệm nội bộ, chỉ lộ khi bị SQL Injection)
INSERT INTO phones (name, brand, price, storage, color, quantity, status, description) VALUES
-- Sản phẩm công khai (status = 'on')
('iPhone 15 Pro Max', 'Apple', 29990000, '256GB', 'Titan Tự Nhiên', 15, 'on', 'Chip Apple A17 Pro 3nm, khung viền titan siêu bền, camera tiềm vọng 5x thế hệ mới.'),
('iPhone 14', 'Apple', 17490000, '128GB', 'Xanh Midnight', 20, 'on', 'Màn hình Super Retina XDR 6.1 inch, chip A15 Bionic 5 nhân GPU, quay phim Cinematic.'),
('Samsung Galaxy S24 Ultra', 'Samsung', 27990000, '256GB', 'Xám Titan', 12, 'on', 'Công nghệ Galaxy AI toàn diện, màn hình phẳng 2600 nits, camera mắt thần 200MP kèm bút S-Pen.'),
('Xiaomi 14 Ultra', 'Xiaomi', 24990000, '512GB', 'Đen Huyền Bí', 8, 'on', 'Cụm 4 camera Leica 50MP cảm biến 1 inch, chip Snapdragon 8 Gen 3 cực đỉnh.'),
('OPPO Find X7 Ultra', 'OPPO', 21990000, '256GB', 'Nâu Da Bò', 10, 'on', 'Hệ thống camera Hasselblad tiềm vọng kép đầu tiên trên smartphone, sạc nhanh SuperVOOC 100W.'),
('Google Pixel 8 Pro', 'Google Pixel', 19990000, '128GB', 'Porcelain Trắng', 7, 'on', 'Chip Google Tensor G3, nhiếp ảnh thuật toán AI đỉnh cao, hỗ trợ cập nhật Android 7 năm.'),

-- Sản phẩm bị ẩn (status = 'off' - Mẫu thử nghiệm nội bộ lab)
('iPhone 16 Pro Prototype', 'Apple', 34990000, '512GB', 'Desert Titanium', 2, 'off', '[BẢO MẬT NỘI BỘ] Bản thử nghiệm phím Capture Button chuyên dụng, chip Apple A18 Pro chưa công bố.'),
('Samsung Galaxy Z Fold 7 Secret Edition', 'Samsung', 45990000, '1TB', 'Phantom Shadow', 1, 'off', '[MẪU LAB NỘI BỘ] Thiết kế siêu mỏng gập không nếp gấp, bản lề titan nguyên khối chưa ra mắt.'),
('Xiaomi MIX Fold 5 Prototype', 'Xiaomi', 31990000, '512GB', 'Gốm Trắng', 3, 'off', '[CHƯA CÔNG BỐ] Thử nghiệm pin thể rắn 6000mAh và sạc siêu nhanh 150W không dây.'),
('Google Pixel 9 Ultra Concept', 'Google Pixel', 28990000, '256GB', 'Obsidian Black', 2, 'off', '[BÍ MẬT DỰ ÁN] Nguyên mẫu cảm biến quang phổ độc quyền kết hợp trợ lý AI Gemini Nano v2.');
