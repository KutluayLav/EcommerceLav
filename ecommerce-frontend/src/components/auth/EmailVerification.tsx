'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, CheckCircle, RefreshCw } from 'lucide-react';
import { verifyEmailSuccess } from '@/features/auth/authSlice';
import { RootState } from '@/store';

interface EmailVerificationProps {
  email: string;
  onResendEmail: () => void;
  onBackToLogin: () => void;
}

export default function EmailVerification({ email, onResendEmail, onBackToLogin }: EmailVerificationProps) {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Otomatik olarak bir sonraki input'a geç
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }

    // Kod tamamlandığında otomatik doğrula
    if (newCode.every(digit => digit !== '') && !isVerified) {
      handleVerifyCode(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyCode = async (code: string) => {
    setIsVerifying(true);
    
    try {
      // Simulated API call - gerçek uygulamada API çağrısı yapılacak
      setTimeout(() => {
        // Doğrulama başarılı (demo için her zaman başarılı)
        setIsVerified(true);
        dispatch(verifyEmailSuccess());
        setIsVerifying(false);
      }, 1500);
    } catch (error) {
      setIsVerifying(false);
      // Hata durumunda kodu temizle
      setVerificationCode(['', '', '', '', '', '']);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setCanResend(false);
    setCountdown(60);
    
    try {
      // Simulated API call
      setTimeout(() => {
        setIsResending(false);
        onResendEmail();
      }, 1000);
    } catch (error) {
      setIsResending(false);
      setCanResend(true);
    }
  };

  if (isVerified) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-green-500" />
        </div>
        
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
          E-posta Doğrulandı!
        </h2>
        
        <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
          E-posta adresiniz başarıyla doğrulandı. Artık hesabınızı kullanabilirsiniz.
        </p>
        
        <button
          onClick={onBackToLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-150 ease-in-out text-sm sm:text-base"
        >
          Giriş Sayfasına Dön
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8">
      <div className="text-center mb-6 sm:mb-8">
        <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">E-posta Doğrulama</h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          <span className="font-medium break-all">{email}</span> adresine gönderilen 6 haneli kodu girin
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Doğrulama Kodu
          </label>
          <div className="flex justify-center space-x-2 sm:space-x-3">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isVerifying}
              />
            ))}
          </div>
        </div>

        {isVerifying && (
          <div className="text-center">
            <div className="inline-flex items-center text-blue-600">
              <RefreshCw className="animate-spin h-5 w-5 mr-2" />
              Doğrulanıyor...
            </div>
          </div>
        )}

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Kod gelmedi mi?
          </p>
          {canResend ? (
            <button
              onClick={handleResendCode}
              disabled={isResending}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              {isResending ? 'Gönderiliyor...' : 'Yeniden Gönder'}
            </button>
          ) : (
            <p className="text-gray-500">
              Yeniden gönderebilirsiniz: {countdown}s
            </p>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={onBackToLogin}
            className="text-gray-600 hover:text-gray-500 text-sm"
          >
            Giriş sayfasına dön
          </button>
        </div>
      </div>
    </div>
  );
} 