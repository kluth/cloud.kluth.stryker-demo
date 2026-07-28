export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  searchTerm?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  color?: string;
  size?: string;
  additionalPrice?: number;
}

// 1. Cart Models
export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
  addedAt: string;
}

export interface Coupon {
  code: string;
  type: 'PERCENTAGE' | 'FIXED' | 'FREESHIP';
  value: number;
  minOrderValue?: number;
}

export type SupportedCurrency = 'USD' | 'EUR' | 'GBP';

// 2. Checkout Models
export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ShippingMethod {
  id: 'standard' | 'express' | 'overnight';
  name: string;
  cost: number;
  estimatedDays: number;
}

export interface PaymentDetails {
  method: 'CREDIT_CARD' | 'PAYPAL' | 'INVOICE';
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  paypalEmail?: string;
}

export interface OrderConfirmation {
  orderId: string;
  timestamp: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  shippingMethod: ShippingMethod;
  paymentMethod: string;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
}

// 3. Search & Filter Models
export type SortOption = 'price_asc' | 'price_desc' | 'rating_desc' | 'name_asc';

export interface FilterState {
  searchTerm: string;
  categories: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  selectedTags: string[];
}

export interface ProductFacets {
  categoryCounts: Record<string, number>;
  priceRange: { min: number; max: number };
  stockCount: { inStock: number; outOfStock: number };
  ratingCounts: Record<number, number>;
}

// 4. Loyalty Models
export type LoyaltyTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface LoyaltyTransaction {
  id: string;
  type: 'EARNED' | 'REDEEMED' | 'BONUS';
  points: number;
  description: string;
  date: string;
}

export interface LoyaltyVoucher {
  id: string;
  code: string;
  title: string;
  pointsCost: number;
  discountValue: number;
  discountType: 'PERCENTAGE' | 'FIXED';
  minOrderAmount: number;
  isRedeemed?: boolean;
}