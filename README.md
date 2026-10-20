# WEBSITE DEMO TẤN CÔNG & PHÒNG CHỐNG SQL INJECTION (SQLi ATTACK & DEFENSE LAB)

Hệ thống Website Lab hoàn chỉnh phục vụ bài báo cáo chuyên đề/giữa kỳ với đề tài: **“Tấn công và Phòng chống SQL Injection”**.

Ứng dụng thực hiện truy vấn SQL thực tế trên cơ sở dữ liệu MySQL (hỗ trợ Aiven Cloud Database kết nối qua TLS/SSL), phân tích chuyên sâu hai chế độ:
- 🚨 **Vulnerable (Lỗ hổng):** Cố tình chứa lỗ hổng nối chuỗi SQL trực tiếp, cho phép khai thác Bypass Xác thực và làm lộ sản phẩm bí mật.
- 🛡️ **Secure (Bảo vệ):** Khắc phục triệt để bằng cơ chế **Prepared Statements** (Parameterized Queries).

---

## 1. Tổng quan dự án

Website gồm 2 chức năng chính:
1. **Đăng nhập (Login - `/login`):**
   - **Vulnerable:** Khai thác SQL Injection để vượt qua xác thực mà không cần mật khẩu chính xác.
   - **Secure:** Ngăn chặn đăng nhập trái phép, vô hiệu hóa hoàn toàn chuỗi injection.
2. **Tìm kiếm điện thoại (Product Search - `/products`):**
   - **Vulnerable:** Khai thác SQL Injection trong mệnh đề `WHERE` và `LIKE` để làm lộ 4 mẫu điện thoại thử nghiệm bí mật (`status = 'off'`). Khi bị lộ, giao diện hiển thị badge nổi bật **`HIDDEN – EXPOSED BY SQL INJECTION`**.
   - **Secure:** Cơ chế Prepared Statements đảm bảo các sản phẩm `status = 'off'` tuyệt đối không bị rò rỉ.

---

## 2. Công nghệ sử dụng

### Frontend
- **React 18** + **Vite**: Xây dựng SPA hiện đại, tốc độ cao.
- **Tailwind CSS**: Thiết kế giao diện phong cách **Modern Cybersecurity Dashboard**, hỗ trợ cả Dark Mode và Light Mode.
- **React Router DOM v6**: Quản lý điều hướng và Route Guard bảo vệ trang riêng tư.
- **Axios**: Giao tiếp HTTP RESTful API với backend, hỗ trợ Session Cookie (`withCredentials: true`).
- **Lucide React**: Bộ icon trực quan sinh động.

### Backend
- **Node.js** + **Express.js**: Máy chủ API RESTful được cấu hình lắng nghe cục bộ `127.0.0.1:5000`.
- **mysql2/promise**: Quản lý Connection Pool, hỗ trợ Prepared Statements (`execute`) và truy vấn chuỗi (`query`).
- **express-session**: Quản lý phiên làm việc, phân biệt phiên hợp lệ và **Injection Demo Session**.
- **cors**, **helmet**: Bảo vệ HTTP Headers và phân quyền chia sẻ tài nguyên.
- **dotenv**: Quản lý biến môi trường bảo mật.

### Cơ sở dữ liệu
- **MySQL trên nền tảng đám mây Aiven** (hoặc MySQL Localhost).
- Hỗ trợ kết nối bảo mật qua SSL/TLS với chứng chỉ CA.
- Tuyệt đối không hardcode thông tin kết nối trong mã nguồn.

---

## 3. Cấu trúc thư mục

```text
BMUDVHT/
├── frontend/                     # Mã nguồn ứng dụng React + Vite
│   ├── public/                   # Tài nguyên tĩnh
│   ├── src/
│   │   ├── api/
│   │   │   ├── axiosClient.js    # Cấu hình Axios instance & interceptors
│   │   │   ├── authApi.js        # API xác thực (login, logout, session, db status)
│   │   │   └── phoneApi.js       # API tìm kiếm sản phẩm (vulnerable & secure)
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── SecurityTabs.jsx   # Chuyển đổi tab Vulnerable / Secure
│   │   │   │   └── ThemeToggle.jsx    # Chuyển đổi Dark / Light mode
│   │   │   ├── auth/
│   │   │   │   └── LoginForm.jsx      # Form đăng nhập kèm nút Autofill lab
│   │   │   └── phones/
│   │   │       ├── PhoneCard.jsx      # Card sản phẩm (Badge HIDDEN nổi bật)
│   │   │       ├── PhoneGrid.jsx      # Danh sách sản phẩm dạng Grid
│   │   │       └── SearchBar.jsx      # Thanh tìm kiếm kèm nút Autofill lab
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx   # Quản lý trạng thái phiên đăng nhập toàn cục
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx     # Trang đăng nhập (/login)
│   │   │   └── ProductsPage.jsx  # Trang cửa hàng điện thoại (/products)
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx# Route Guard kiểm tra session
│   │   ├── App.jsx               # Cấu hình Routing
│   │   ├── main.jsx              # Điểm khởi chạy React
│   │   └── index.css             # Thiết lập Tailwind & Animations
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
├── backend/                      # Mã nguồn máy chủ Node.js + Express
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js       # Quản lý Connection Pool & SSL Aiven
│   │   ├── controllers/
│   │   │   ├── vulnerableController.js # Xử lý truy vấn nối chuỗi (lỗ hổng)
│   │   │   └── secureController.js     # Xử lý Prepared Statements (an toàn)
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js       # Bảo vệ endpoint yêu cầu đăng nhập
│   │   │   ├── errorMiddleware.js      # Xử lý lỗi tập trung, che giấu stack trace
│   │   │   └── labOnlyMiddleware.js    # Giới hạn chỉ chạy trong chế độ Lab localhost
│   │   ├── routes/
│   │   │   ├── authRoutes.js           # Routes /api/auth
│   │   │   ├── vulnerableRoutes.js     # Routes /api/vulnerable
│   │   │   └── secureRoutes.js         # Routes /api/secure
│   │   ├── services/
│   │   │   └── authService.js          # Tiện ích che mật khẩu, làm sạch user
│   │   └── app.js                # Cấu hình Express, CORS, Session
│   ├── scripts/
│   │   └── initDb.js             # Script tự động khởi tạo Schema & Seed lên MySQL
│   ├── server.js                 # Lắng nghe 127.0.0.1:5000 & kiểm tra DB
│   ├── .env.example              # Mẫu biến môi trường
│   ├── .env                      # File cấu hình thực tế
│   └── package.json
│
├── database/                     # Kịch bản cơ sở dữ liệu
│   ├── schema.sql                # Định nghĩa bảng users & phones
│   └── seed.sql                  # 5 tài khoản mẫu & 10 sản phẩm điện thoại
│
├── .gitignore
├── package.json                  # Scripts khởi chạy nhanh toàn bộ dự án
└── README.md                     # Tài liệu hướng dẫn chi tiết
```

---

## 4. Cách cài đặt Dependencies

Mở Terminal tại thư mục gốc của dự án (`BMUDVHT`):

```bash
# Cài đặt đồng thời cho cả Backend và Frontend:
npm run install:all

# Hoặc cài đặt thủ công từng phần:
cd backend && npm install
cd ../frontend && npm install
```

---

## 5. Cách cấu hình Aiven MySQL

Khi bạn tạo dịch vụ MySQL trên [Aiven](https://aiven.io), bạn sẽ nhận được thông tin kết nối gồm:
- **Host** (e.g. `mysql-xxxx.aivencloud.com`)
- **Port** (e.g. `12345` hoặc `3306`)
- **User** (e.g. `avnadmin`)
- **Password** (e.g. `AVNS_...`)
- **Database** (e.g. `defaultdb` hoặc `sql_injection_demo`)
- **CA Certificate** (tùy chọn tải về dưới dạng `ca.pem`)

### Các bước cấu hình:
1. Mở file `backend/.env` (hoặc copy từ `backend/.env.example`).
2. Điền thông tin nhận được từ Aiven:

```env
DB_HOST=mysql-xxxx-your-project.aivencloud.com
DB_PORT=12345
DB_USER=avnadmin
DB_PASSWORD=your_aiven_password_here
DB_NAME=defaultdb
DB_SSL_CA_PATH=

PORT=5000
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=sqli_defense_demo_secret_2026
LAB_MODE=true
```

> **Lưu ý về SSL Aiven:** Hệ thống đã được lập trình sẵn để tự động kích hoạt mã hóa SSL/TLS khi phát hiện kết nối đến domain `aivencloud.com`. Nếu bạn tải file chứng chỉ `ca.pem` của Aiven về thư mục `backend/ca.pem`, bạn chỉ cần khai báo `DB_SSL_CA_PATH=ca.pem`.

---

## 6. Cách khởi tạo Database (`schema.sql` và `seed.sql`)

Dự án cung cấp sẵn kịch bản tự động `npm run db:init` giúp tạo cấu trúc bảng và nạp toàn bộ dữ liệu mẫu lên Aiven MySQL chỉ với 1 câu lệnh duy nhất:

```bash
# Chạy từ thư mục gốc:
npm run db:init

# Hoặc từ thư mục backend:
cd backend
npm run db:init
```

Script sẽ tự động:
1. Tạo bảng `users` (5 tài khoản).
2. Tạo bảng `phones` (10 sản phẩm: 6 `on` và 4 `off`).
3. Xuất thống kê chi tiết số lượng bản ghi lên màn hình console.

---

## 7. Cách chạy Backend Server

```bash
cd backend
npm run dev
```

Backend sẽ khởi động tại: `http://127.0.0.1:5000`.
Máy chủ sẽ tự động ping kiểm tra kết nối tới Aiven MySQL và hiển thị thông báo trạng thái.

---

## 8. Cách chạy Frontend

Mở một cửa sổ Terminal mới:

```bash
cd frontend
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`. Truy cập trình duyệt để trải nghiệm website.

---

## 9. Danh sách Tài khoản Demo & Dữ liệu Seed

### Bảng `users` (5 tài khoản):
| Username | Password | Role | Mô tả |
|---|---|---|---|
| `admin` | `admin123` | `admin` | Quản trị viên hệ thống |
| `manager` | `manager123` | `admin` | Trưởng phòng quản lý |
| `demo` | `demo123` | `user` | Tài khoản trải nghiệm demo |
| `john_doe` | `password123` | `user` | Khách hàng thường 1 |
| `alice_smith` | `alice2026` | `user` | Khách hàng thường 2 |

### Bảng `phones` (10 sản phẩm):
- **6 sản phẩm công khai (`status = 'on'`):**
  1. iPhone 15 Pro Max (Apple, 29.990.000 ₫)
  2. iPhone 14 (Apple, 17.490.000 ₫)
  3. Samsung Galaxy S24 Ultra (Samsung, 27.990.000 ₫)
  4. Xiaomi 14 Ultra (Xiaomi, 24.990.000 ₫)
  5. OPPO Find X7 Ultra (OPPO, 21.990.000 ₫)
  6. Google Pixel 8 Pro (Google Pixel, 19.990.000 ₫)
- **4 sản phẩm bị ẩn / Mẫu thử nghiệm nội bộ (`status = 'off'`):**
  7. iPhone 16 Pro Prototype (Apple, 34.990.000 ₫)
  8. Samsung Galaxy Z Fold 7 Secret Edition (Samsung, 45.990.000 ₫)
  9. Xiaomi MIX Fold 5 Prototype (Xiaomi, 31.990.000 ₫)
  10. Google Pixel 9 Ultra Concept (Google Pixel, 28.990.000 ₫)

---

## 10. Hướng dẫn sử dụng tính năng Đăng nhập (Login Page)

Truy cập đường dẫn `/login`:

### Chế độ 1: Vulnerable Login (Tab Đỏ)
1. **Đăng nhập bình thường:** Nhấn **“Use Sample Account”** (`admin` / `admin123`) -> Nhấn **Xác thực Đăng nhập**. Câu SQL thực thi có điều kiện khớp -> Đăng nhập thành công với vai trò Quản trị viên bình thường.
2. **Khai thác SQL Injection:**
   - Nhấn nút **“Use SQL Injection”**. Hệ thống tự động điền:
     - Username: `admin' OR '1' = '1' -- `
     - Password: `any_password`
   - Nhấn **Xác thực Đăng nhập**.
   - **Cơ chế diễn ra tại MySQL:** Câu lệnh SQL trở thành:
     ```sql
     SELECT id, username, password, role FROM users WHERE username = 'admin' OR '1' = '1' -- ' AND password = 'any_password'
     ```
     Ký tự `-- ` biến toàn bộ phần kiểm tra mật khẩu phía sau thành chú thích (comment). MySQL kiểm tra điều kiện `username = 'admin' OR '1' = '1'` luôn đúng và trả về bản ghi hợp lệ.
   - Hệ thống ghi nhận phiên đăng nhập là **`INJECTION DEMO SESSION`** và chuyển hướng tới `/products`.

### Chế độ 2: Secure Login (Tab Xanh)
1. Nhấn **“Use Sample Account”** (`admin` / `admin123`) -> Đăng nhập thành công.
2. Nhấn **“Use SQL Injection”** (`admin' OR '1' = '1' -- `) -> Nhấn **Xác thực Đăng nhập**.
3. **Kết quả:** Đăng nhập thất bại! Prepared Statement biến chuỗi `admin' OR '1' = '1' -- ` thành tham số thuần túy (string literal), không làm thay đổi cấu trúc truy vấn.

---

## 11. Hướng dẫn sử dụng tính năng Tìm kiếm (Products Page)

Truy cập đường dẫn `/products`:

### Chế độ 1: Vulnerable Search (Tab Đỏ)
1. **Tìm kiếm bình thường:** Nhấn **“Use Sample Search”** (`iPhone`) -> Nhấn **Tìm kiếm**.
   - Câu SQL thực thi:
     ```sql
     SELECT * FROM phones WHERE status = 'on' AND name LIKE '%iPhone%'
     ```
   - Trả về đúng 2 chiếc iPhone công khai (`status = 'on'`).
2. **Khai thác SQL Injection làm lộ sản phẩm bí mật:**
   - Nhấn nút **“Use SQL Injection”**. Hệ thống tự động điền:
     ```text
     %' OR '1'='1' -- 
     ```
   - Nhấn **Tìm kiếm**.
   - **Cơ chế diễn ra tại MySQL:** Câu lệnh SQL trở thành:
     ```sql
     SELECT * FROM phones WHERE status = 'on' AND name LIKE '%%' OR '1'='1' -- %'
     ```
     Do độ ưu tiên của toán tử logic, điều kiện `OR '1'='1'` luôn luôn mang giá trị `TRUE` cho mọi hàng. MySQL bỏ qua ràng buộc `status = 'on'` và trả về **TOÀN BỘ 10 SẢN PHẨM**.
   - **Giao diện phản hồi:**
     - Xuất hiện Banner đỏ cảnh báo: **`SQL Injection succeeded: hidden products were exposed!`**
     - 4 sản phẩm bí mật xuất hiện kèm hiệu ứng nhấp nháy và badge đỏ rực: **`🚨 HIDDEN – EXPOSED BY SQL INJECTION`**.

### Chế độ 2: Secure Search (Tab Xanh)
1. Nhấn nút **“Use SQL Injection”** (`%' OR '1'='1' -- `).
2. Nhấn **Tìm kiếm**.
3. **Kết quả:** Prepared Statement ràng buộc toàn bộ chuỗi `%...%` vào placeholder `?`:
   ```sql
   SELECT * FROM phones WHERE status = 'on' AND name LIKE ?
   -- Parameters: ["%%' OR '1'='1' -- %"]
   ```
   MySQL tìm kiếm các sản phẩm công khai có tên chứa đúng chuỗi ký tự trên. Kết quả trả về 0 sản phẩm. **Tuyệt đối không có bất kỳ sản phẩm bí mật (`status = 'off'`) nào bị rò rỉ!**

---

## 12. Phân tích Lý thuyết SQL Injection

### Nguyên nhân cốt lõi (Root Cause)
SQL Injection xảy ra khi **dữ liệu do người dùng cung cấp (Untrusted User Input)** bị ghép chuỗi trực tiếp (String Concatenation/Interpolation) với câu lệnh truy vấn SQL của máy chủ.

Khi kẻ tấn công đưa vào các ký tự điều khiển cú pháp của ngôn ngữ SQL (như dấu nháy đơn `'`, dấu chấm phẩy `;`, toán tử `OR`, `AND`, dấu chú thích `-- ` hoặc `#`), trình biên dịch SQL hiểu lầm dữ liệu là lệnh điều khiển (Code), từ đó làm thay đổi logic thực thi của truy vấn gốc.

---

## 13. Cơ chế Phòng chống bằng Prepared Statements

Prepared Statements (Parameterized Queries) là biện pháp phòng vệ chuẩn mực và hiệu quả nhất chống lại SQL Injection:

1. **Tách biệt Mã lệnh và Dữ liệu:**
   - **Giai đoạn 1 (Prepare):** Máy chủ gửi cấu trúc câu truy vấn có các dấu giữ chỗ (placeholders `?`) đến cơ sở dữ liệu. MySQL phân tích cú pháp (Parsing), kiểm tra ngữ nghĩa và tối ưu hóa cây cú pháp trừu tượng (Abstract Syntax Tree - AST).
   - **Giai đoạn 2 (Execute):** Ứng dụng gửi các tham số (parameters) riêng biệt đến cơ sở dữ liệu.
2. **Triệt tiêu khả năng thực thi mã độc:**
   - Tại cơ sở dữ liệu, các tham số luôn được xử lý nghiêm ngặt dưới dạng giá trị thuần túy (Literals) tương ứng với kiểu dữ liệu của cột.
   - Mọi ký tự đặc biệt (`'`, `"`, `--`, `OR`) chỉ được coi là nội dung văn bản, không bao giờ được phân tích thành toán tử điều khiển.

---

## 14. Các lưu ý bảo mật khi vận hành phòng Lab

1. **Giới hạn Localhost:** Toàn bộ API và Backend server được bind chặt chẽ vào địa chỉ nội bộ `127.0.0.1`.
2. **Khóa môi trường Lab (`LAB_MODE=true`):** Chỉ cho phép thực thi endpoint có lỗ hổng khi cờ môi trường `LAB_MODE=true` được bật.
3. **Phân quyền tối thiểu (Least Privilege):** Tài khoản MySQL Aiven cho phòng lab chỉ được phép thao tác trên schema mẫu, không cấp quyền quản trị hệ thống (`SUPER`, `GRANT OPTION`).
4. **Vô hiệu hóa Multiple Statements:** Tắt tính năng thực thi nhiều lệnh cùng lúc (`multipleStatements: false`) trên connection pool ứng dụng để ngăn ngừa rủi ro Stacked Queries phá hủy cấu trúc bảng.
5. **Dữ liệu giả lập hoàn toàn:** Không lưu trữ bất kỳ thông tin cá nhân hay mật khẩu thực tế nào trên cơ sở dữ liệu.
6. **Không triển khai Public:** Tuyệt đối không deploy phiên bản Vulnerable lên các nền tảng hosting công khai như Vercel, Render hay VPS công cộng.

---

## 15. Bảng kiểm thử chi tiết (Test Cases Verification)

| ID | Chức năng | Trường hợp kiểm thử | Kết quả kỳ vọng |
|---|---|---|---|
| **TC01** | Login Vulnerable | Nhập tài khoản hợp lệ (`admin` / `admin123`) | Đăng nhập thành công với vai trò Quản trị viên |
| **TC02** | Login Secure | Nhập tài khoản hợp lệ (`admin` / `admin123`) | Đăng nhập thành công với cơ chế bảo vệ an toàn |
| **TC03** | Login Vulnerable | Nhập sai mật khẩu (`admin` / `wrong_pass`) | Báo lỗi đăng nhập thất bại |
| **TC04** | Login Secure | Nhập sai mật khẩu (`admin` / `wrong_pass`) | Báo lỗi đăng nhập thất bại |
| **TC05** | Login Vulnerable | Nhập SQLi (`admin' OR '1' = '1' -- ` / mật khẩu bất kỳ) | Vượt qua xác thực thành công trong lab |
| **TC06** | Login Secure | Nhập cùng chuỗi SQLi (`admin' OR '1' = '1' -- `) | Bị từ chối xác thực, đăng nhập thất bại |
| **TC07** | Search Vulnerable | Tìm kiếm từ khóa bình thường `iPhone` | Chỉ trả về các mẫu iPhone có `status = 'on'` |
| **TC08** | Search Secure | Tìm kiếm từ khóa bình thường `iPhone` | Chỉ trả về các mẫu iPhone có `status = 'on'` |
| **TC09** | Search Vulnerable | Khai thác SQLi payload `%' OR '1'='1' -- ` | Trả về đủ 10 sản phẩm (gồm 4 sản phẩm ẩn) |
| **TC10** | Search Secure | Dùng cùng payload `%' OR '1'='1' -- ` | Chỉ tìm theo chuỗi literal, không lộ sản phẩm `status = 'off'` |
| **TC11** | Product UI | Sản phẩm bí mật (`off`) xuất hiện | Hiển thị badge đỏ nổi bật: `HIDDEN – EXPOSED BY SQL INJECTION` |
| **TC12** | Logout | Người dùng nhấn nút Logout | Hủy Session, xóa cookie, chuyển về `/login` |
| **TC13** | Route Guard | Chưa đăng nhập cố truy cập `/products` | Tự động chuyển hướng về `/login` |
| **TC14** | Database | Chưa cấu hình hoặc sai thông tin Aiven | Hiển thị thông báo hướng dẫn rõ ràng trên giao diện |
