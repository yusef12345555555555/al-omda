export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  price: number;
  unit?: 'piece' | 'kg';
  image: string;
  categoryId: string;
  available: boolean;
  isBest: boolean;
  isFeatured: boolean;
  tag?: string; // e.g. "الأكثر مبيعاً", "جديد", "توقيع العمدة", "عرض خاص"
  prepTime?: string;
  calories?: number;
  portionOptions?: { name: string; price: number; factor?: number }[];
  spiciness?: 0 | 1 | 2 | 3;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  image: string;
  background?: string;
  atmosphereTheme: 'grill' | 'meal' | 'sandwiches' | 'platters' | 'mixes' | 'settlements' | 'additions' | 'custom';
  displayOrder: number;
  active: boolean;
  badge?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteSettings {
  restaurantName: string;
  restaurantNameEn: string;
  tagline: string;
  taglineEn: string;
  address: string;
  addressEn: string;
  phone: string;
  phoneSecondary?: string;
  whatsappNumber: string;
  whatsappCta: string;
  whatsappCtaEn: string;
  footerText: string;
  footerTextEn: string;
  workingHours: string;
  workingHoursEn: string;
  announcement?: string;
  announcementActive?: boolean;
  // الشعار (Logo) — يظهر بدل أيقونة اللهب الافتراضية في الهيدر والإنترو
  logoUrl?: string;
  // الشارة الصغيرة بجانب اسم المطعم في الهيدر (مثلاً: "مشويات")
  navBadgeText?: string;
  navBadgeTextEn?: string;
  // السطر الصغير تحت الاسم في الهيدر (مثلاً: "أصالة الطعم المصري")
  navSubtitle?: string;
  navSubtitleEn?: string;
}

export interface SocialMediaCard {
  id: string;
  platform: 'facebook' | 'instagram' | 'tiktok' | 'whatsapp' | 'youtube' | 'twitter' | 'other';
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  url: string;
  active: boolean;
  displayOrder: number;
}

export interface VisitorAnalytics {
  totalVisits: number;
  todayVisits: number;
  lastVisitDate: string;
  productViews: Record<string, number>;
  whatsappClicks: number;
  categoryViews: Record<string, number>;
}

export type PageView = 'home' | 'categories' | 'category-detail' | 'best' | 'favorites' | 'admin' | 'product-detail';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

export interface AdminLoginResponse {
  token: string;
  admin: AdminUser;
}

// -------------------------------------------------------------
// SITE CONTENT (Supabase-backed, Draft vs Published)
// -------------------------------------------------------------
// هذا هو الشكل الموحّد للمحتوى الذي يُخزَّن كـ JSON داخل site_draft.data
// و site_published.data على Supabase. كل شاشات الأدمن تعدّل على هذا الشكل.

export interface SiteContent {
  settings: WebsiteSettings;
  categories: Category[];
  products: Product[];
  socialMedia: SocialMediaCard[];
}

export interface PublishInfo {
  version: number;
  publishedAt: string;
  publishedBy?: string; // admin email
}

// -------------------------------------------------------------
// SHOPPING CART (client-side only — used to compose the WhatsApp order)
// -------------------------------------------------------------
export interface CartItem {
  productId: string;
  name: string;
  nameEn?: string;
  price: number;
  image: string;
  quantity: number;
}
