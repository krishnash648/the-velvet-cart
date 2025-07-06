import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion'; // 👈 animation wrapper
import { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LoadingSpinner from './components/LoadingSpinner';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const Categories = lazy(() => import('./pages/Categories'));
const About = lazy(() => import('./pages/About'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Profile = lazy(() => import('./pages/Profile'));
const OrderTrackingPage = lazy(() => import('./pages/OrderTracking'));
const Admin = lazy(() => import('./pages/Admin'));
const Chatbot = lazy(() => import('./components/Chatbot'));

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <Suspense fallback={<LoadingSpinner text="Loading Home..." />}>
            <Home />
          </Suspense>
        } />
        <Route path="/products" element={
          <Suspense fallback={<LoadingSpinner text="Loading Products..." />}>
            <Products />
          </Suspense>
        } />
        <Route path="/categories" element={
          <Suspense fallback={<LoadingSpinner text="Loading Categories..." />}>
            <Categories />
          </Suspense>
        } />
        <Route path="/about" element={
          <Suspense fallback={<LoadingSpinner text="Loading About..." />}>
            <About />
          </Suspense>
        } />
        <Route path="/product/:id" element={
          <Suspense fallback={<LoadingSpinner text="Loading Product..." />}>
            <ProductDetail />
          </Suspense>
        } />
        <Route path="/cart" element={
          <Suspense fallback={<LoadingSpinner text="Loading Cart..." />}>
            <Cart />
          </Suspense>
        } />
        <Route path="/checkout" element={
          <Suspense fallback={<LoadingSpinner text="Loading Checkout..." />}>
            <Checkout />
          </Suspense>
        } />
        <Route path="/profile" element={
          <Suspense fallback={<LoadingSpinner text="Loading Profile..." />}>
            <Profile />
          </Suspense>
        } />
        <Route path="/track-order" element={
          <Suspense fallback={<LoadingSpinner text="Loading Order Tracking..." />}>
            <OrderTrackingPage />
          </Suspense>
        } />
        <Route path="/admin" element={
          <Suspense fallback={<LoadingSpinner text="Loading Admin..." />}>
            <Admin />
          </Suspense>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Toaster position="top-right" reverseOrder={false} />
            <Navbar />
            <AnimatedRoutes />
            <Suspense fallback={null}>
              <Chatbot />
            </Suspense>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
