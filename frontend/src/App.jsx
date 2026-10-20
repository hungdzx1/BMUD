import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { ProductsPage } from './pages/ProductsPage';

// Component điều hướng thông minh ở root '/'
const RootRedirect = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/products" replace /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* TRANG GỐC */}
            <Route path="/" element={<RootRedirect />} />

            {/* TRANG ĐĂNG NHẬP */}
            <Route path="/login" element={<LoginPage />} />

            {/* TRANG SẢN PHẨM (ĐƯỢC BẢO VỆ BỞI PROTECTED ROUTE) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/products" element={<ProductsPage />} />
            </Route>

            {/* CÁC ĐƯỜNG DẪN KHÁC */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
