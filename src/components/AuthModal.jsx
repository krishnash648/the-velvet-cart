import { useState } from 'react';
import { createPortal } from 'react-dom';
import Login from './Login';
import Register from './Register';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center overflow-auto">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-md mx-4 flex flex-col items-center justify-center bg-transparent pt-10" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="sticky top-0 right-0 z-20 flex justify-end w-full -mt-10 mb-2">
          <button
            onClick={onClose}
            className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-300 shadow-lg"
            aria-label="Close modal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="w-full">
          {isLogin ? (
            <Login onSwitchToRegister={() => setIsLogin(false)} />
          ) : (
            <Register onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default AuthModal; 
