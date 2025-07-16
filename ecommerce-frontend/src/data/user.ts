// data/user.ts
import { User } from '@/types';

export const mockUser: User = {
  name: 'Jane Doe',
  role: 'Premium Member',
  email: 'jane.doe@example.com',
  phone: '+1 (555) 987-6543',
  avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
  bio: 'Tech enthusiast, avid reader, and coffee lover.',
  lastLogin: '3 days ago',
  orders: 42,
  wishlistItems: 10,
  memberSince: 'January 2021',

  ordersHistory: [
    { id: 'A123', date: '2025-07-10', total: 129.99, status: 'Delivered' },
    { id: 'B456', date: '2025-06-28', total: 59.49, status: 'Shipped' },
    { id: 'C789', date: '2025-06-15', total: 230.0, status: 'Processing' },
  ],
  addresses: [
    {
      id: 'addr1',
      label: 'Home',
      addressLine1: '123 Main St',
      addressLine2: 'Apt 4B',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62704',
      country: 'USA',
      phone: '+1 (555) 123-4567',
    },
    {
      id: 'addr2',
      label: 'Work',
      addressLine1: '456 Corporate Blvd',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62703',
      country: 'USA',
    },
  ],
  wishlist: [
    {
      id: 'p1',
      title: 'Wireless Headphones',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=80&q=80',
      price: 99.99,
      category: 'electronics',
      rating: 4.6,
      tag: 'popular',
    },
    {
      id: 'p2',
      title: 'Smart Watch',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=80&q=80',
      price: 199.99,
      category: 'electronics',
      rating: 4.3,
      tag: 'featured',
    },
    {
      id: 'p3',
      title: 'E-book Reader',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=80&q=80',
      price: 129.99,
      category: 'books',
      rating: 4.5,
      tag: 'new',
    },
  ],

  profileSettings: {
    receiveNewsletter: true,
    preferredLanguage: 'English',
  },
};
