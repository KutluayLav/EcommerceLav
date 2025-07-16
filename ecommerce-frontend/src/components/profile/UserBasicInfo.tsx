import type { User } from '@/types';
import { Edit } from 'lucide-react';

type UserBasicInfoProps = {
  user: User;
};

export function UserBasicInfo({ user }: UserBasicInfoProps) {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-center justify-center gap-6 md:gap-12">
      {/* Avatar ve edit ikonu */}
      <div className="relative flex-shrink-0">
        <img
          src={user.avatarUrl}
          alt={`${user.name} avatar`}
          className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover shadow-xl border-4 border-primary"
        />
        {/* Resim edit ikonu, sağ alt köşede */}
        <button
          aria-label="Edit profile picture"
          className="absolute bottom-1 right-1 bg-primary p-1 rounded-full shadow-md hover:bg-red-700 transition"
        >
          <Edit className="w-5 h-5 text-bgwhite" />
        </button>
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
