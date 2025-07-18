export type Product = {
  _id?: string;
  id?: string;
  name: string;
  title?: string;
  price: number;
  images: string[];
  image?: string;
  rating?: number;
  originalPrice?: number;
  description?: string;
  popularity?: number;
  category: string;
  tag?: 'featured' | 'new' | 'popular' | 'all';
  stock?: number;
  specifications?: {
    [key: string]: string;
  };
  tags?: string[];
  featured?: boolean;
  popular?: boolean;
  newArrival?: boolean;
  variants?: {
    size?: string;
    color?: string;
    stock: number;
  }[];
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

export interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
  price: number;
  variant?: {
    size?: string;
    color?: string;
  };
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  totalPrice: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id?: string;
  _id?: string;
  label?: string;
  addressLine1?: string;
  street?: string;
  addressLine2?: string;
  city: string;
  state?: string;
  zipCode?: string;
  postalCode?: string;
  country: string;
  phone?: string;
}

export interface ProfileSettings {
  receiveNewsletter: boolean;
  preferredLanguage: string;
}

export type User = {
  id?: string;
  avatar?: string;
  isEmailVerified?: boolean;
  name: string;
  role: string;
  email: string;
  phone: string;
  image?: string | null | undefined; // Profil resmi dosya adı
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

export type CartItem = {
  _id: string;
  price: number;
  quantity: number;
  product: {
    _id: string;
    name: string;
    images: string[];
  };
};
