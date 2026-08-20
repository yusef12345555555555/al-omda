import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_SOCIAL_MEDIA } from '../data/initialData';
import {
  Category,
  Product,
  SocialMediaCard,
  VisitorAnalytics,
  WebsiteSettings,
  PageView,
  AdminUser,
  SiteContent,
  PublishInfo,
  CartItem,
} from '../types';

interface StoreContextType {
  // Navigation & View
  currentView: PageView;
  setCurrentView: (view: PageView) => void;
  selectedCategoryId: string | null;
  setSelectedCategoryId: (catId: string | null) => void;
  selectedProductId: string | null;
  setSelectedProductId: (prodId: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Language & Audio
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  isAudioMuted: boolean;
  toggleAudio: () => void;

  // Data State (PUBLISHED — what customers see)
  products: Product[];
  categories: Category[];
  settings: WebsiteSettings;
  socialMedia: SocialMediaCard[];
  favorites: string[];
  visitorStats: VisitorAnalytics;
  isLoadingData: boolean;
  publishInfo: PublishInfo | null;

  // Favorites Actions
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  openProductPage: (productId: string) => void;

  // Admin Actions — Products (write to DRAFT)
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  toggleProductAvailability: (id: string) => Promise<boolean>;
  toggleProductBest: (id: string) => Promise<boolean>;

  // Admin Actions — Categories (write to DRAFT)
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  reorderCategories: (newOrderedList: Category[]) => Promise<boolean>;

  // Admin Actions — Settings & Social (write to DRAFT)
  updateSettings: (newSettings: Partial<WebsiteSettings>) => Promise<boolean>;
  updateSocialMedia: (cards: SocialMediaCard[]) => Promise<boolean>;
  resetToDefaults: () => Promise<void>;

  // Draft / Publish workflow
  draftProducts: Product[];
  draftCategories: Category[];
  draftSettings: WebsiteSettings;
  draftSocialMedia: SocialMediaCard[];
  hasUnpublishedChanges: boolean;
  isPublishing: boolean;
  publishChanges: () => Promise<{ success: boolean; error?: string }>;

  // Analytics logging (fire-and-forget, non-blocking)
  logProductClick: (productId: string) => void;
  logWhatsAppClick: () => void;
  logCategoryView: (categoryId: string) => void;

  // Shopping Cart (client-side, feeds the WhatsApp order message)
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Admin Authentication (Supabase Auth — Email + Password)
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => Promise<void>;
  fetchLiveData: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEYS = {
  FAVORITES: 'alomda_favorites_v1',
  LANG: 'alomda_lang_v1',
  CART: 'alomda_cart_v1',
};

const FALLBACK_CONTENT: SiteContent = {
  settings: INITIAL_SETTINGS,
  categories: INITIAL_CATEGORIES,
  products: INITIAL_PRODUCTS,
  socialMedia: INITIAL_SOCIAL_MEDIA,
};

const nowIso = () => new Date().toISOString();
const genId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Route state
  const [currentView, setCurrentViewState] = useState<PageView>(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      return 'admin';
    }
    return 'home';
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  const [language, setLanguageState] = useState<'ar' | 'en'>('ar');
  const [isAudioMuted] = useState(true); // Silent by default — no audio in this project

  // PUBLISHED content — what customers actually see
  const [publishedContent, setPublishedContent] = useState<SiteContent>(FALLBACK_CONTENT);
  const [publishInfo, setPublishInfo] = useState<PublishInfo | null>(null);

  // DRAFT content — what the admin is currently editing (only loaded once authenticated)
  const [draftContent, setDraftContent] = useState<SiteContent>(FALLBACK_CONTENT);

  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [visitorStats, setVisitorStats] = useState<VisitorAnalytics>({
    totalVisits: 0,
    todayVisits: 0,
    lastVisitDate: nowIso(),
    productViews: {},
    whatsappClicks: 0,
    categoryViews: {},
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  const draftContentRef = useRef(draftContent);
  draftContentRef.current = draftContent;

  // ---------------------------------------------------------------------
  // Navigation helpers
  // ---------------------------------------------------------------------
  const setCurrentView = useCallback((view: PageView) => {
    setCurrentViewState(view);
    if (typeof window !== 'undefined') {
      const targetPath = view === 'admin' ? '/admin' : '/';
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
    }
  }, []);

  const setLanguage = useCallback((lang: 'ar' | 'en') => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.LANG, lang);
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  }, []);

  const toggleAudio = useCallback(() => {
    // Audio is permanently disabled per product requirement. No-op kept for API compatibility.
  }, []);

  // ---------------------------------------------------------------------
  // LOAD PUBLISHED CONTENT (customer-facing, no auth required)
  // ---------------------------------------------------------------------
  const fetchPublishedContent = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const { data, error } = await supabase
        .from('site_published')
        .select('data, version, published_at, published_by')
        .eq('id', 1)
        .maybeSingle();

      if (!error && data) {
        const content = data.data as SiteContent;
        setPublishedContent({
          settings: { ...FALLBACK_CONTENT.settings, ...content.settings },
          categories: content.categories?.length ? content.categories : [],
          products: content.products?.length ? content.products : [],
          socialMedia: content.socialMedia?.length ? content.socialMedia.slice(0, 3) : [],
        });
        setPublishInfo({
          version: data.version,
          publishedAt: data.published_at,
          publishedBy: data.published_by || undefined,
        });
      }
    } catch (err) {
      console.warn('تعذر تحميل المحتوى المنشور من Supabase، سيتم استخدام بيانات افتراضية محلياً.', err);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  // Realtime: عندما ينشر الأدمن تعديلات، حدّث الموقع للعملاء المتصلين تلقائياً
  useEffect(() => {
    fetchPublishedContent();

    const channel = supabase
      .channel('site_published_changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'site_published', filter: 'id=eq.1' },
        () => {
          fetchPublishedContent();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPublishedContent]);

  // Log a lightweight visit event once per session load (customer pages only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.pathname.startsWith('/admin')) return;
    supabase
      .from('analytics_events')
      .insert({ event_type: 'visit', meta: { path: window.location.pathname } })
      .then(() => {}, () => {});
  }, []);

  // Restore language & favorites from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedLang = localStorage.getItem(STORAGE_KEYS.LANG) as 'ar' | 'en' | null;
    if (savedLang) setLanguage(savedLang);
    const savedFav = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (savedFav) {
      try {
        setFavorites(JSON.parse(savedFav));
      } catch {
        /* ignore corrupt favorites */
      }
    }
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        /* ignore corrupt cart */
      }
    }
  }, [setLanguage]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    }
  }, [favorites]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    }
  }, [cart]);

  // Handle Browser Back/Forward
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.startsWith('/admin')) {
        setCurrentViewState('admin');
      } else {
        setCurrentViewState('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // ---------------------------------------------------------------------
  // ADMIN AUTHENTICATION (Supabase Auth)
  // ---------------------------------------------------------------------

  const loadAdminProfileAndDraft = useCallback(async (userId: string, email: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email, name, created_at')
      .eq('id', userId)
      .maybeSingle();

    if (!profile) {
      // مستخدم موجود في Auth لكن غير مسجّل كأدمن في profiles → مرفوض
      await supabase.auth.signOut();
      setIsAdminAuthenticated(false);
      setAdminUser(null);
      return false;
    }

    setAdminUser({ id: profile.id, email: profile.email, name: profile.name, createdAt: profile.created_at });
    setIsAdminAuthenticated(true);

    // Load draft content (create it from published if missing)
    const { data: draftRow } = await supabase.from('site_draft').select('data').eq('id', 1).maybeSingle();
    if (draftRow) {
      setDraftContent(draftRow.data as SiteContent);
    } else {
      setDraftContent(publishedContent);
    }

    // Load lightweight visitor stats for the analytics tab
    fetchVisitorStats();

    return true;
  }, [publishedContent]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;
      if (session?.user) {
        loadAdminProfileAndDraft(session.user.id, session.user.email || '');
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setIsAdminAuthenticated(false);
        setAdminUser(null);
      }
    });

    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const adminLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) {
        return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
      }
      const ok = await loadAdminProfileAndDraft(data.user.id, data.user.email || '');
      if (!ok) {
        return { success: false, error: 'هذا الحساب غير مصرح له بالدخول إلى لوحة التحكم' };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: 'تعذر الاتصال بخادم المصادقة (Supabase)' };
    }
  };

  const adminLogout = async () => {
    await supabase.auth.signOut();
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    setCurrentView('home');
  };

  // ---------------------------------------------------------------------
  // VISITOR ANALYTICS (simple counts — no POS, no inventory, menu-only)
  // ---------------------------------------------------------------------
  const fetchVisitorStats = useCallback(async () => {
    try {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const [{ count: totalVisits }, { count: todayVisits }, { count: whatsappClicks }] = await Promise.all([
        supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'visit'),
        supabase
          .from('analytics_events')
          .select('*', { count: 'exact', head: true })
          .eq('event_type', 'visit')
          .gte('created_at', startOfToday.toISOString()),
        supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'whatsapp_click'),
      ]);

      setVisitorStats((prev) => ({
        ...prev,
        totalVisits: totalVisits || 0,
        todayVisits: todayVisits || 0,
        whatsappClicks: whatsappClicks || 0,
        lastVisitDate: nowIso(),
      }));
    } catch {
      /* analytics are best-effort only */
    }
  }, []);

  const fetchLiveData = useCallback(async () => {
    await fetchPublishedContent();
  }, [fetchPublishedContent]);

  // ---------------------------------------------------------------------
  // DRAFT PERSISTENCE — كل تعديل من الأدمن يُحفظ فوراً في site_draft
  // ---------------------------------------------------------------------
  const persistDraft = async (nextContent: SiteContent): Promise<boolean> => {
    setDraftContent(nextContent);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('site_draft')
        .upsert({
          id: 1,
          data: nextContent,
          updated_at: nowIso(),
          updated_by: userData.user?.id,
        });
      return !error;
    } catch {
      return false;
    }
  };

  // ---------------------------------------------------------------------
  // PRODUCTS (draft)
  // ---------------------------------------------------------------------
  const addProduct = async (prodData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    const newProduct: Product = { ...prodData, id: genId('prod'), createdAt: nowIso(), updatedAt: nowIso() };
    return persistDraft({ ...draftContentRef.current, products: [...draftContentRef.current.products, newProduct] });
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<boolean> => {
    const products = draftContentRef.current.products.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: nowIso() } : p
    );
    return persistDraft({ ...draftContentRef.current, products });
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    const products = draftContentRef.current.products.filter((p) => p.id !== id);
    return persistDraft({ ...draftContentRef.current, products });
  };

  const toggleProductAvailability = async (id: string): Promise<boolean> => {
    const p = draftContentRef.current.products.find((x) => x.id === id);
    if (!p) return false;
    return updateProduct(id, { available: !p.available });
  };

  const toggleProductBest = async (id: string): Promise<boolean> => {
    const p = draftContentRef.current.products.find((x) => x.id === id);
    if (!p) return false;
    return updateProduct(id, { isBest: !p.isBest });
  };

  // ---------------------------------------------------------------------
  // CATEGORIES (draft)
  // ---------------------------------------------------------------------
  const addCategory = async (catData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    const newCategory: Category = { ...catData, id: genId('cat'), createdAt: nowIso(), updatedAt: nowIso() };
    return persistDraft({ ...draftContentRef.current, categories: [...draftContentRef.current.categories, newCategory] });
  };

  const updateCategory = async (id: string, updates: Partial<Category>): Promise<boolean> => {
    const categories = draftContentRef.current.categories.map((c) =>
      c.id === id ? { ...c, ...updates, updatedAt: nowIso() } : c
    );
    return persistDraft({ ...draftContentRef.current, categories });
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    const categories = draftContentRef.current.categories.filter((c) => c.id !== id);
    return persistDraft({ ...draftContentRef.current, categories });
  };

  const reorderCategories = async (newOrderedList: Category[]): Promise<boolean> => {
    return persistDraft({ ...draftContentRef.current, categories: newOrderedList });
  };

  // ---------------------------------------------------------------------
  // SETTINGS & SOCIAL MEDIA (draft)
  // ---------------------------------------------------------------------
  const updateSettings = async (newSettings: Partial<WebsiteSettings>): Promise<boolean> => {
    const settings = { ...draftContentRef.current.settings, ...newSettings };
    return persistDraft({ ...draftContentRef.current, settings });
  };

  const updateSocialMedia = async (cards: SocialMediaCard[]): Promise<boolean> => {
    return persistDraft({ ...draftContentRef.current, socialMedia: cards.slice(0, 3) });
  };

  const resetToDefaults = async () => {
    await persistDraft(FALLBACK_CONTENT);
  };

  // ---------------------------------------------------------------------
  // PUBLISH — زر "رفع التعديلات": ينشر كل تعديلات المسودة دفعة واحدة
  // ---------------------------------------------------------------------
  const publishChanges = async (): Promise<{ success: boolean; error?: string }> => {
    const draft = draftContentRef.current;

    // Basic validation before publishing (per requirement: don't publish broken content)
    if (!draft.settings.restaurantName?.trim()) {
      return { success: false, error: 'اسم المطعم مطلوب في الإعدادات قبل النشر' };
    }
    if (!draft.settings.whatsappNumber?.trim()) {
      return { success: false, error: 'رقم الواتساب مطلوب في الإعدادات قبل النشر' };
    }
    const invalidProduct = draft.products.find((p) => !p.name?.trim() || !p.image?.trim() || p.price < 0);
    if (invalidProduct) {
      return { success: false, error: `يوجد صنف غير مكتمل البيانات: "${invalidProduct.name || 'بدون اسم'}"` };
    }

    setIsPublishing(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const { data: current } = await supabase.from('site_published').select('version').eq('id', 1).maybeSingle();
      const nextVersion = (current?.version || 0) + 1;

      const { error: publishError } = await supabase
        .from('site_published')
        .update({
          data: draft,
          version: nextVersion,
          published_at: nowIso(),
          published_by: userData.user?.id,
        })
        .eq('id', 1);

      if (publishError) {
        return { success: false, error: publishError.message };
      }

      await supabase.from('publish_history').insert({
        version: nextVersion,
        data: draft,
        published_by: userData.user?.id,
      });

      setPublishedContent(draft);
      setPublishInfo({ version: nextVersion, publishedAt: nowIso(), publishedBy: adminUser?.email });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'فشل نشر التعديلات' };
    } finally {
      setIsPublishing(false);
    }
  };

  const hasUnpublishedChanges = JSON.stringify(draftContent) !== JSON.stringify(publishedContent);

  // ---------------------------------------------------------------------
  // Favorites & navigation
  // ---------------------------------------------------------------------
  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  const openProductPage = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ---------------------------------------------------------------------
  // Shopping Cart — يجمع الأصناف قبل إرسالها كطلب واحد لواتساب
  // ---------------------------------------------------------------------
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          nameEn: product.nameEn,
          price: product.price,
          image: product.image,
          quantity,
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => prev.map((item) => (item.productId === productId ? { ...item, quantity } : item)));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  // ---------------------------------------------------------------------
  // Analytics logging (fire-and-forget)
  // ---------------------------------------------------------------------
  const logProductClick = (productId: string) => {
    supabase.from('analytics_events').insert({ event_type: 'product_view', meta: { productId } }).then(() => {}, () => {});
  };

  const logWhatsAppClick = () => {
    setVisitorStats((prev) => ({ ...prev, whatsappClicks: prev.whatsappClicks + 1 }));
    supabase.from('analytics_events').insert({ event_type: 'whatsapp_click', meta: {} }).then(() => {}, () => {});
  };

  const logCategoryView = (categoryId: string) => {
    supabase.from('analytics_events').insert({ event_type: 'category_view', meta: { categoryId } }).then(() => {}, () => {});
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedCategoryId,
        setSelectedCategoryId,
        selectedProductId,
        setSelectedProductId,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        language,
        setLanguage,
        isAudioMuted,
        toggleAudio,
        products: publishedContent.products,
        categories: publishedContent.categories,
        settings: publishedContent.settings,
        socialMedia: publishedContent.socialMedia,
        favorites,
        visitorStats,
        isLoadingData,
        publishInfo,
        toggleFavorite,
        isFavorite,
        openProductPage,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,
        toggleProductBest,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        updateSettings,
        updateSocialMedia,
        resetToDefaults,
        draftProducts: draftContent.products,
        draftCategories: draftContent.categories,
        draftSettings: draftContent.settings,
        draftSocialMedia: draftContent.socialMedia,
        hasUnpublishedChanges,
        isPublishing,
        publishChanges,
        logProductClick,
        logWhatsAppClick,
        logCategoryView,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        isAdminAuthenticated,
        adminUser,
        adminLogin,
        adminLogout,
        fetchLiveData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
