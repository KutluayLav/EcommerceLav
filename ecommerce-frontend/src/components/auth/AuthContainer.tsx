'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import EmailVerification from './EmailVerification';
import { RootState } from '@/store';

type AuthMode = 'login' | 'signup' | 'verify-email' | 'forgot-password';

export default function AuthContainer() {
  const pathname = usePathname();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [pendingEmail, setPendingEmail] = useState('');

  // URL'ye göre başlangıç modunu ayarla
  useEffect(() => {
    if (pathname === '/auth/signup') {
      setAuthMode('signup');
    } else if (pathname === '/auth/verify-email') {
      setAuthMode('verify-email');
    } else {
      setAuthMode('login');
    }
  }, [pathname]);
  
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Eğer kullanıcı giriş yapmışsa ve e-posta doğrulanmamışsa doğrulama sayfasını göster
  if (user && !user.isEmailVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
        <EmailVerification
          email={user.email}
          onResendEmail={() => {
            // E-posta yeniden gönderme işlemi
            console.log('E-posta yeniden gönderildi');
          }}
          onBackToLogin={() => {
            setAuthMode('login');
          }}
        />
      </div>
    );
  }

  // Eğer kullanıcı tamamen giriş yapmışsa dashboard'a yönlendir
  if (isAuthenticated && user?.isEmailVerified) {
    // Router ile dashboard'a yönlendirme yapılacak
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Giriş Başarılı!</h2>
          <p className="text-gray-600 mb-6">Dashboard'a yönlendiriliyorsunuz...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  const handleSwitchToSignup = () => {
    setAuthMode('signup');
  };

  const handleSwitchToLogin = () => {
    setAuthMode('login');
  };

  const handleForgotPassword = () => {
    setAuthMode('forgot-password');
  };

  const handleEmailVerificationNeeded = (email: string) => {
    setPendingEmail(email);
    setAuthMode('verify-email');
  };

  const renderAuthComponent = () => {
    switch (authMode) {
      case 'login':
        return (
          <LoginForm
            onSwitchToSignup={handleSwitchToSignup}
            onForgotPassword={handleForgotPassword}
          />
        );
      
      case 'signup':
        return (
          <SignupForm
            onSwitchToLogin={handleSwitchToLogin}
          />
        );
      
      case 'verify-email':
        return (
          <EmailVerification
            email={pendingEmail || user?.email || ''}
            onResendEmail={() => {
              console.log('E-posta yeniden gönderildi');
            }}
            onBackToLogin={handleSwitchToLogin}
          />
        );
      
      case 'forgot-password':
        return (
          <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Şifre Sıfırlama</h2>
            <p className="text-gray-600 mb-6">Bu özellik yakında eklenecek.</p>
            <button
              onClick={handleSwitchToLogin}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Giriş sayfasına dön
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
      {renderAuthComponent()}
    </div>
  );
} 