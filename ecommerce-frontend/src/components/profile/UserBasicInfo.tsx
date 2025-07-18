import type { User } from '@/types';
import { useState, useRef } from 'react';
import { Edit } from 'lucide-react';
import { User as IconUser } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setUserImage } from '@/features/auth/authSlice';

type UserBasicInfoProps = {
  user: User;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5050';

export function UserBasicInfo({ user }: UserBasicInfoProps) {
  const [avatar, setAvatar] = useState<string | null>(user.image ? `${BACKEND_URL}/uploads/users/${user.image}` : null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hovered, setHovered] = useState(false);
  const dispatch = useDispatch();

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    setError('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/upload-avatar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.image) {
        setAvatar(`${BACKEND_URL}/uploads/users/${data.image}`);
        dispatch(setUserImage(data.image));
      } else {
        setError(data.message || 'Resim yüklenemedi.');
      }
    } catch (err) {
      setError('Resim yüklenemedi.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center md:items-center justify-center gap-6 md:gap-12">
      {/* Avatar ve edit ikonu */}
      <div
        className="relative flex-shrink-0 group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {avatar ? (
          <img
            src={avatar}
            alt={`${user?.name || 'Kullanıcı'} avatar`}
            className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover shadow-xl border-4 border-primary transition-all duration-200 group-hover:opacity-80"
            style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}
            onClick={handleEditClick}
          />
        ) : (
          <div
            className="w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center rounded-full bg-gray-200 shadow-xl border-4 border-primary cursor-pointer group-hover:opacity-80"
            onClick={handleEditClick}
          >
            <IconUser className="w-16 h-16 text-gray-400" />
          </div>
        )}
        {/* Overlay - Hover veya yükleme sırasında */}
        {(hovered && !uploading) && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-full transition-all duration-200 cursor-pointer" onClick={handleEditClick}>
            <Edit className="w-7 h-7 text-white mb-1" />
            <span className="text-white text-xs font-medium">Fotoğrafı Değiştir</span>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center rounded-full">
            <svg className="animate-spin h-7 w-7 text-primary mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
            <span className="text-xs text-primary font-medium">Yükleniyor...</span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
        {error && (
          <div className="absolute left-1/2 -bottom-8 -translate-x-1/2 bg-red-600 text-white text-xs px-3 py-1 rounded shadow-lg z-10">
            {error}
          </div>
        )}
      </div>

      {/* Metin alanı */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* İsim */}
        <div className="flex items-center gap-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blackheading truncate">{user.name}</h1>
          <button aria-label="Edit name" className="hover:text-primary transition">
            <Edit className="w-5 h-5 text-gray-400 hover:text-primary cursor-pointer" />
          </button>
        </div>

        {/* Diğer bilgiler (role, bio) sade */}
        {user.role && (
          <p className="text-primary font-semibold text-lg truncate">{user.role}</p>
        )}
        {user.bio && (
          <p className="text-darkgray/90 leading-relaxed max-w-prose">{user.bio}</p>
        )}

        {/* Temel detaylar - sadece email ve phone yanında edit ikonu */}
        <div className="space-y-2 text-sm sm:text-base text-darkgray/80">
          <div className="flex items-center gap-2">
            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <button aria-label="Edit email" className="hover:text-primary transition">
              <Edit className="w-4 h-4 text-gray-400 hover:text-primary cursor-pointer" />
            </button>
          </div>

          {user.phone && (
            <div className="flex items-center gap-2">
              <p>
                <span className="font-semibold">Phone:</span> {user.phone}
              </p>
              <button aria-label="Edit phone" className="hover:text-primary transition">
                <Edit className="w-4 h-4 text-gray-400 hover:text-primary cursor-pointer" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
