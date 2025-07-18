'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, Mail, Lock, User, Check } from 'lucide-react';
import { signupStart, signupSuccess, signupFailure } from '@/features/auth/authSlice';
import { RootState } from '@/store';
import { User as UserType } from '@/features/auth/authSlice';
import { register as registerApi } from '@/services/authService';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export default function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      dispatch(signupFailure('Ad Soyad gereklidir'));
      return false;
    }
    if (!formData.email.trim()) {
      dispatch(signupFailure('E-posta adresi gereklidir'));
      return false;
    }
    if (!formData.password) {
      dispatch(signupFailure('Şifre gereklidir'));
      return false;
    }
    if (formData.password.length < 6) {
      dispatch(signupFailure('Şifre en az 6 karakter olmalıdır'));
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      dispatch(signupFailure('Şifreler eşleşmiyor'));
      return false;
    }
    if (!agreedToTerms) {
      dispatch(signupFailure('Kullanım koşullarını kabul etmelisiniz'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    dispatch(signupStart());

    try {
      // Simulated API call - gerçek uygulamada API çağrısı yapılacak
      // setTimeout(() => {
      //   const newUser: UserType = {
      //     id: Math.random().toString(36).substr(2, 9),
      //     name: formData.name,
      //     email: formData.email,
      //     isEmailVerified: false // Kayıt sonrası e-posta doğrulaması gerekecek
      //   };
      //   dispatch(signupSuccess(newUser));
      // }, 1000);
      const res = await registerApi({
        firstName: formData.name.split(' ')[0] || formData.name,
        lastName: formData.name.split(' ').slice(1).join(' '),
        email: formData.email,
        password: formData.password
      });
      const userData = res.data;
      dispatch(signupSuccess({
        id: userData._id,
        name: userData.firstName + ' ' + userData.lastName,
        email: userData.email,
        isEmailVerified: userData.emailVerified,
        avatar: userData.avatar || undefined
      }));
    } catch (error: any) {
      dispatch(signupFailure(error.response?.data?.message || 'Kayıt başarısız. Lütfen tekrar deneyin.'));
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: '' };
    if (password.length < 6) return { strength: 1, text: 'Zayıf' };
    if (password.length < 8) return { strength: 2, text: 'Orta' };
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 3, text: 'Güçlü' };
    }
    return { strength: 2, text: 'Orta' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Kayıt Ol</h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">Yeni hesap oluşturun</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Ad Soyad
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              placeholder="Adınız ve soyadınız"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            E-posta Adresi
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              placeholder="ornek@email.com"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Şifre
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              placeholder="Şifrenizi oluşturun"
              value={formData.password}
              onChange={handleInputChange}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          {formData.password && (
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength.strength === 1
                        ? 'bg-red-500 w-1/3'
                        : passwordStrength.strength === 2
                        ? 'bg-yellow-500 w-2/3'
                        : passwordStrength.strength === 3
                        ? 'bg-green-500 w-full'
                        : 'w-0'
                    }`}
                  />
                </div>
                <span className="text-sm text-gray-600">{passwordStrength.text}</span>
              </div>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Şifre Tekrarı
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              placeholder="Şifrenizi tekrar girin"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-1">
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <Check className="h-5 w-5 text-green-500" />
              )}
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="agree-terms"
            name="agree-terms"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
          />
          <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
            <a href="#" className="text-blue-600 hover:text-blue-500">Kullanım koşullarını</a> ve{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">gizlilik politikasını</a> kabul ediyorum
          </label>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
              isLoading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {isLoading ? 'Kayıt oluşturuluyor...' : 'Kayıt Ol'}
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Zaten hesabınız var mı?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Giriş yap
            </button>
          </p>
        </div>
      </form>
    </div>
  );
} 