export type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  rating?: number;
  category: 'electronics' | 'books' | 'fashion' | 'home';
  tag?: 'featured' | 'new' | 'popular';
};

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5 stars
  title: string;
  comment: string;
  date: string;
  verified: boolean; // if user actually purchased the product
  helpful: number; // number of people who found this review helpful
  userMarkedHelpful?: boolean; // if current user marked this helpful
}

export interface Order {
  id: string;
  date: string; 
  total: number;
  status: string;
}

export interface Address {
  id: string;
  label: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface ProfileSettings {
  receiveNewsletter: boolean;
  preferredLanguage: string;
}

export type User = {
  name: string;
  role: string;
  email: string;
  phone: string;
  avatarUrl: string;
  bio: string;
  lastLogin: string;
  orders: number;
  wishlistItems: number;
  memberSince: string;

  ordersHistory: Order[];
  addresses: Address[];
  wishlist: Product[];

  profileSettings: {
    receiveNewsletter: boolean;
    preferredLanguage: string;
  };
};
