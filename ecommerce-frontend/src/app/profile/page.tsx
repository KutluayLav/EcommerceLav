'use client';

import { ProfileCard } from '@/components/profile/ProfileCard';
import { mockUser } from '@/data/user';  // Kullanıcı verisini buradan alıyoruz

export default function ProfilePage() {
  return (
    <main className="bg-bgwhite px-6 py-12 md:px-12 flex justify-center">
      <ProfileCard user={mockUser} />
    </main>
  );
}
