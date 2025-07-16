'use client';

import { UserBasicInfo } from './UserBasicInfo';
import { OrderHistory } from './OrderHistory';
import { AddressBook } from './AddressBook';
import { Wishlist } from './WishList';
import { ProfileSettingsSection } from './ProfileSettingsSection';
import type { User } from '@/types';

type ProfileCardProps = {
  user: User;
};

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <section className="w-full max-w-7xl mx-auto bg-bgwhite p-6 sm:p-8 md:p-12 rounded-xl shadow-lg text-darkgray">
      <div className="flex flex-col gap-4">
        {/* Üst kısım: UserBasicInfo ve ProfileSettingsSection yan yana */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          <div className="flex-1">
            <UserBasicInfo user={user} />
          </div>
          <div className="w-full md:w-80">
            <ProfileSettingsSection profileSettings={user.profileSettings} />
          </div>
        </div>

        {/* Alt kısım: 2 sütunlu grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <OrderHistory ordersHistory={user.ordersHistory} />
          <AddressBook addresses={user.addresses} />
          <Wishlist wishlist={user.wishlist} />
        </div>

      </div>
    </section>
  );
}
