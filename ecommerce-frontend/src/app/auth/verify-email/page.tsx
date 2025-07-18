'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AuthContainer from '@/components/auth/AuthContainer';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (token && email) {
      verifyEmail();
    }
  }, [token, email]);

  const verifyEmail = async () => {
    setIsVerifying(true);
    try {
      const response = await fetch(`http://localhost:5050/api/users/verify-email?token=${token}&email=${email}`);
      const data = await response.json();
      
      if (response.ok) {
        setVerificationResult({ success: true, message: data.message });
        // 3 saniye sonra login sayfasına yönlendir
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } else {
        setVerificationResult({ success: false, message: data.message });
      }
    } catch (error) {
      setVerificationResult({ 
        success: false, 
        message: 'Email doğrulama sırasında bir hata oluştu.' 
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Eğer token ve email varsa, doğrulama sonucunu göster
  if (token && email) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
          {isVerifying ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Email Doğrulanıyor...</h2>
              <p className="text-gray-600">Lütfen bekleyin</p>
            </>
          ) : verificationResult ? (
            <>
              <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-4 ${
                verificationResult.success ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <span className={`text-2xl ${verificationResult.success ? 'text-green-600' : 'text-red-600'}`}>
                  {verificationResult.success ? '✓' : '✗'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {verificationResult.success ? 'Email Doğrulandı!' : 'Doğrulama Başarısız'}
              </h2>
              <p className="text-gray-600 mb-4">{verificationResult.message}</p>
              {verificationResult.success && (
                <p className="text-sm text-blue-600">Giriş sayfasına yönlendiriliyorsunuz...</p>
              )}
            </>
          ) : (
            <AuthContainer />
          )}
        </div>
      </div>
    );
  }

  // Token veya email yoksa normal AuthContainer'ı göster
  return <AuthContainer />;
} 