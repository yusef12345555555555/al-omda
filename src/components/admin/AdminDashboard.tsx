import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Package, 
  Layers, 
  Settings, 
  Share2, 
  Plus, 
  Edit3, 
  Trash2, 
  Upload, 
  Eye, 
  EyeOff, 
  Star, 
  Sparkles, 
  Check, 
  X, 
  Save, 
  RotateCcw, 
  LogOut, 
  ExternalLink, 
  MessageCircle, 
  Phone, 
  MapPin, 
  Flame, 
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  UserCheck,
  Rocket,
  Clock3,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, Category, SocialMediaCard, WebsiteSettings } from '../../types';
import { AdminLoginPage } from './AdminLoginPage';
import { uploadSiteImage } from '../../lib/supabaseClient';

// Curated high-res culinary image presets for quick admin selection
const PRESET_FOOD_IMAGES = [
  { name: 'ريش ضاني مشوية', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
  { name: 'طرب وكفتة على الفحم', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80' },
  { name: 'كباب بتلو متبل', url: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80' },
  { name: 'شيش طاووق دجاج', url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80' },
  { name: 'سندوتش كفتة بلدي', url: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=800&q=80' },
  { name: 'حواوشي مقرمش ع الفحم', url: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80' },
  { name: 'صينية مشويات عملاقة', url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80' },
  { name: 'طاجن لحمة بالبصل', url: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80' },
  { name: 'أرز بسمتي بالمكسرات', url: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80' },
  { name: 'مقبلات وسلطات طازجة', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80' },
];

export const AdminDashboard: React.FC = () => {
  const {
    // نقرأ وننعدّل على "المسودة" (Draft) — لا يظهر أي تعديل للعميل إلا بعد "رفع التعديلات"
    draftProducts: products,
    draftCategories: categories,
    draftSettings: settings,
    draftSocialMedia: socialMedia,
    visitorStats,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability,
    toggleProductBest,
    addCategory,
    updateCategory,
    deleteCategory,
    updateSettings,
    updateSocialMedia,
    resetToDefaults,
    hasUnpublishedChanges,
    isPublishing,
    publishChanges,
    publishInfo,
    isAdminAuthenticated,
    adminUser,
    adminLogout,
    setCurrentView,
    language
  } = useStore();

  // ملحوظة مهمة: كل الـ Hooks تُستدعى دائماً بنفس الترتيب في كل تصيير (Render)
  // حتى لو المستخدم غير مسجّل دخول بعد — لتفادي مخالفة قواعد React Hooks.
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'settings' | 'social' | 'analytics'>('products');
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Product Editing State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState<{
    name: string;
    nameEn: string;
    description: string;
    descriptionEn: string;
    price: number;
    image: string;
    categoryId: string;
    available: boolean;
    isBest: boolean;
    tag: string;
    prepTime: string;
    calories: number;
  }>({
    name: '',
    nameEn: '',
    description: '',
    descriptionEn: '',
    price: 150,
    image: PRESET_FOOD_IMAGES[0].url,
    categoryId: categories[0]?.id || 'grills',
    available: true,
    isBest: false,
    tag: 'جديد',
    prepTime: '15 دقيقة',
    calories: 500,
  });

  // Category Editing State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState<{
    name: string;
    nameEn: string;
    description: string;
    descriptionEn: string;
    image: string;
    background: string;
    badge: string;
    atmosphereTheme: Category['atmosphereTheme'];
    displayOrder: number;
    active: boolean;
  }>({
    name: '',
    nameEn: '',
    description: '',
    descriptionEn: '',
    image: PRESET_FOOD_IMAGES[0].url,
    background: PRESET_FOOD_IMAGES[0].url,
    badge: 'جديد',
    atmosphereTheme: 'grill',
    displayOrder: categories.length + 1,
    active: true,
  });

  // Settings Local Form State
  const [settingsForm, setSettingsForm] = useState<WebsiteSettings>(settings);

  // Social Media Local Form State
  const [socialForm, setSocialForm] = useState<SocialMediaCard[]>(socialMedia);

  // 🔧 إصلاح مهم: المسودة (draft) بتتحمّل من Supabase بعد لحظة قصيرة من تسجيل
  // الدخول، فلو النموذج اتبنى قبل وصولها هيفضل فاضي/قديم. الكود ده بيزامن
  // نموذجي الإعدادات والسوشيال ميديا تلقائياً بمجرد ما بيانات المسودة الحقيقية توصل
  // (بما فيها أي شعار أو نص كان محفوظ من قبل)، بدون ما يمسح أي تعديل غير محفوظ
  // بالغلط لأنه بيتفعّل بس لما الداتا المصدرية فعلاً تتغيّر.
  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  useEffect(() => {
    setSocialForm(socialMedia);
  }, [socialMedia]);

  // Handle native file image upload from device → يرفع الصورة فعلياً إلى Supabase Storage
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'product' | 'category' | 'categoryBg') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const folder = target === 'product' ? 'products' : target === 'category' ? 'categories' : 'backgrounds';
      const publicUrl = await uploadSiteImage(file, folder);

      if (target === 'product') {
        setProductForm((prev) => ({ ...prev, image: publicUrl }));
      } else if (target === 'category') {
        setCategoryForm((prev) => ({ ...prev, image: publicUrl }));
      } else if (target === 'categoryBg') {
        setCategoryForm((prev) => ({ ...prev, background: publicUrl }));
      }
      showToast('تم رفع الصورة بنجاح إلى مكتبة الوسائط!');
    } catch (err: any) {
      showToast(err.message || 'فشل رفع الصورة، حاول مرة أخرى.');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handlePublish = async () => {
    setPublishError(null);
    const res = await publishChanges();
    if (res.success) {
      showToast('🚀 تم رفع التعديلات بنجاح، وأصبحت ظاهرة لكل العملاء الآن!');
    } else {
      setPublishError(res.error || 'فشل نشر التعديلات');
    }
  };

  // الآن بعد استدعاء كل الـ Hooks بأمان: نعرض شاشة الدخول إن لم يكن مسجّلاً كأدمن
  if (!isAdminAuthenticated) {
    return <AdminLoginPage />;
  }

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, productForm);
      showToast(`تم تحديث الصنف "${productForm.name}" بنجاح!`);
      setEditingProduct(null);
    } else {
      addProduct({
        ...productForm,
        isFeatured: productForm.isBest,
      });
      showToast(`تمت إضافة الصنف "${productForm.name}" بنجاح إلى المنيو!`);
      setIsNewProductModalOpen(false);
    }
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryForm);
      showToast(`تم تحديث القسم "${categoryForm.name}" بنجاح!`);
      setEditingCategory(null);
    } else {
      addCategory(categoryForm);
      showToast(`تمت إضافة القسم "${categoryForm.name}" بنجاح!`);
      setIsNewCategoryModalOpen(false);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    showToast('تم حفظ إعدادات الموقع ومعلومات التواصل فوراً!');
  };

  const handleSaveSocial = (e: React.FormEvent) => {
    e.preventDefault();
    updateSocialMedia(socialForm);
    showToast('تم حفظ وتحديث بطاقات التواصل الاجتماعي الثلاث!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="admin-dashboard-container">
      
      {/* Toast Notification */}
      {successToast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-2xl flex items-center gap-2 border border-emerald-400"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>{successToast}</span>
        </motion.div>
      )}

      {/* Publish Validation Error Banner */}
      {publishError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-rose-600 text-white font-bold text-sm shadow-2xl flex items-center gap-2 border border-rose-400 max-w-lg text-center"
        >
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{publishError}</span>
          <button type="button" onClick={() => setPublishError(null)} className="ms-2">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Unpublished Changes Notice */}
      {hasUnpublishedChanges && !publishError && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold font-['Cairo'] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            {language === 'ar'
              ? 'يوجد تعديلات لم تُنشر بعد. لن يراها العملاء حتى تضغط "رفع التعديلات" أعلى الصفحة.'
              : 'You have unpublished changes. Customers will not see them until you press "Publish Changes".'}
          </span>
        </div>
      )}

      {/* Admin Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-stone-900 border border-amber-500/30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Settings className="w-6 h-6 animate-spin" style={{ animationDuration: '12s' }} />
          </div>
          <div>
            <h1 className="text-2xl font-black font-['Cairo'] text-stone-100">
              {language === 'ar' ? 'لوحة تحكم إدارة مطعم العمدة' : 'AL OMDA Restaurant Admin Center'}
            </h1>
            <p className="text-xs text-stone-400">
              {language === 'ar'
                ? 'تحكم كامل في المنيو، الأسعار، الأقسام، الصور، إعدادات واتساب والزيارات الحية'
                : 'Manage products, prices, categories, imagery, WhatsApp settings & analytics'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {adminUser && (
            <div className="px-3.5 py-1.5 rounded-xl bg-stone-800/90 border border-amber-500/20 text-stone-300 text-xs font-['Cairo'] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-amber-400 font-bold">{adminUser.email}</span>
            </div>
          )}

          {publishInfo && (
            <div className="px-3.5 py-1.5 rounded-xl bg-stone-800/60 border border-stone-700 text-stone-400 text-[11px] font-['Cairo'] flex items-center gap-1.5" title={publishInfo.publishedAt}>
              <Clock3 className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? `آخر نشر: إصدار #${publishInfo.version}` : `Last publish: v${publishInfo.version}`}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing || !hasUnpublishedChanges}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black font-['Cairo'] transition flex items-center gap-2 shadow-lg ${
              hasUnpublishedChanges
                ? 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-emerald-500/30 animate-pulse'
                : 'bg-stone-800 text-stone-500 cursor-not-allowed'
            }`}
          >
            {isPublishing ? (
              <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Rocket className="w-4 h-4" />
            )}
            <span>
              {isPublishing
                ? (language === 'ar' ? 'جاري النشر...' : 'Publishing...')
                : hasUnpublishedChanges
                ? (language === 'ar' ? '🚀 رفع التعديلات' : 'Publish Changes')
                : (language === 'ar' ? 'لا توجد تعديلات جديدة' : 'No changes to publish')}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold font-['Cairo'] transition flex items-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4 text-amber-400" />
            <span>{language === 'ar' ? 'عرض الموقع كعميل' : 'View Customer Site'}</span>
          </button>

          <button
            type="button"
            onClick={adminLogout}
            className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 text-xs font-bold font-['Cairo'] transition flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <LogOut className="w-4 h-4" />
            <span>{language === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-stone-800 pb-4">
        {[
          { id: 'products', labelAr: `إدارة الأصناف (${products.length})`, labelEn: `Products (${products.length})`, icon: Package },
          { id: 'categories', labelAr: `إدارة الأقسام (${categories.length})`, labelEn: `Categories (${categories.length})`, icon: Layers },
          { id: 'settings', labelAr: 'إعدادات المطعم وواتساب', labelEn: 'Settings & WhatsApp', icon: Settings },
          { id: 'social', labelAr: 'روابط التواصل (3 بطاقات)', labelEn: 'Social Media', icon: Share2 },
          { id: 'analytics', labelAr: 'الزيارات والإحصائيات', labelEn: 'Visitors & Analytics', icon: BarChart3 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold font-['Cairo'] transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/20 font-black'
                  : 'bg-stone-900/80 hover:bg-stone-800 text-stone-300 border border-stone-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{language === 'ar' ? tab.labelAr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* 1. VISITOR ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-400 font-semibold uppercase">
                  {language === 'ar' ? 'إجمالي زيارات العملاء' : 'Total Customer Visits'}
                </span>
                <div className="text-3xl font-black font-['Cairo'] text-amber-400 mt-1">
                  {visitorStats.totalVisits}
                </div>
                <span className="text-[11px] text-emerald-400">
                  {language === 'ar' ? '● زيارات فعلية (تستثني زيارات الإدارة)' : '● Customer sessions only'}
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <BarChart3 className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-400 font-semibold uppercase">
                  {language === 'ar' ? 'زيارات اليوم' : "Today's Visits"}
                </span>
                <div className="text-3xl font-black font-['Cairo'] text-emerald-400 mt-1">
                  {visitorStats.todayVisits}
                </div>
                <span className="text-[11px] text-stone-400 font-mono">
                  {visitorStats.lastVisitDate}
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Flame className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-400 font-semibold uppercase">
                  {language === 'ar' ? 'نقرات وطلبات واتساب' : 'WhatsApp Order Conversions'}
                </span>
                <div className="text-3xl font-black font-['Cairo'] text-emerald-400 mt-1">
                  {visitorStats.whatsappClicks}
                </div>
                <span className="text-[11px] text-emerald-400">
                  {language === 'ar' ? 'تفاعل عالي مع المنيو' : 'High Conversion Rate'}
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <MessageCircle className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Quick Menu Summary */}
          <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 space-y-4">
            <h3 className="text-lg font-bold font-['Cairo'] text-stone-100">
              {language === 'ar' ? 'حالة المنيو الحية' : 'Live Menu Overview'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-stone-800/50 border border-stone-700/50">
                <div className="text-xs text-stone-400">{language === 'ar' ? 'إجمالي الأصناف' : 'Total Items'}</div>
                <div className="text-xl font-bold text-amber-400 font-['Cairo']">{products.length}</div>
              </div>
              <div className="p-4 rounded-2xl bg-stone-800/50 border border-stone-700/50">
                <div className="text-xs text-stone-400">{language === 'ar' ? 'الأصناف المتاحة' : 'Available Items'}</div>
                <div className="text-xl font-bold text-emerald-400 font-['Cairo']">
                  {products.filter((p) => p.available).length}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-stone-800/50 border border-stone-700/50">
                <div className="text-xs text-stone-400">{language === 'ar' ? 'الأصناف الأكثر طلباً' : 'Best Sellers'}</div>
                <div className="text-xl font-bold text-amber-400 font-['Cairo']">
                  {products.filter((p) => p.isBest).length}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-stone-800/50 border border-stone-700/50">
                <div className="text-xs text-stone-400">{language === 'ar' ? 'الأقسام النشطة' : 'Active Categories'}</div>
                <div className="text-xl font-bold text-stone-200 font-['Cairo']">
                  {categories.filter((c) => c.active).length}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PRODUCTS MANAGEMENT TAB */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-black font-['Cairo'] text-stone-100">
              {language === 'ar' ? 'قائمة أصناف المنيو' : 'Menu Products'}
            </h2>

            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setProductForm({
                  name: '',
                  nameEn: '',
                  description: '',
                  descriptionEn: '',
                  price: 200,
                  image: PRESET_FOOD_IMAGES[0].url,
                  categoryId: categories[0]?.id || 'grills',
                  available: true,
                  isBest: false,
                  tag: 'جديد',
                  prepTime: '15-20 دقيقة',
                  calories: 600,
                });
                setIsNewProductModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm font-['Cairo'] shadow-lg flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ar' ? 'إضافة صنف جديد' : 'Add New Product'}</span>
            </button>
          </div>

          {/* Products List Table */}
          <div className="rounded-3xl bg-stone-900 border border-stone-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-stone-950 text-stone-400 uppercase font-bold border-b border-stone-800">
                  <tr>
                    <th className="p-4 text-start">{language === 'ar' ? 'الصورة' : 'Image'}</th>
                    <th className="p-4 text-start">{language === 'ar' ? 'اسم الصنف' : 'Name'}</th>
                    <th className="p-4 text-start">{language === 'ar' ? 'القسم' : 'Category'}</th>
                    <th className="p-4 text-start">{language === 'ar' ? 'السعر' : 'Price'}</th>
                    <th className="p-4 text-center">{language === 'ar' ? 'مميز / Best' : 'Best'}</th>
                    <th className="p-4 text-center">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                    <th className="p-4 text-end">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 font-['Cairo']">
                  {products.map((p) => {
                    const cat = categories.find((c) => c.id === p.categoryId);
                    return (
                      <tr key={p.id} className="hover:bg-stone-800/40 transition">
                        <td className="p-4">
                          <img
                            src={p.image}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-xl object-cover border border-stone-700"
                          />
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-stone-100 text-sm">{p.name}</div>
                          {p.nameEn && <div className="text-[10px] text-stone-400 font-['Outfit']">{p.nameEn}</div>}
                          {p.tag && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold mt-1 inline-block">
                              {p.tag}
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-stone-300 font-medium">
                          {cat?.name || p.categoryId}
                        </td>
                        <td className="p-4 font-black text-amber-400 text-sm">
                          {p.price} ج.م
                        </td>
                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() => toggleProductBest(p.id)}
                            className={`p-1.5 rounded-lg border transition ${
                              p.isBest
                                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                                : 'bg-stone-800 text-stone-500 border-stone-700'
                            }`}
                          >
                            <Star className={`w-4 h-4 ${p.isBest ? 'fill-amber-400' : ''}`} />
                          </button>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() => toggleProductAvailability(p.id)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${
                              p.available
                                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                                : 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                            }`}
                          >
                            {p.available ? (language === 'ar' ? 'متاح' : 'Available') : (language === 'ar' ? 'غير متاح' : 'Unavailable')}
                          </button>
                        </td>
                        <td className="p-4 text-end">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProduct(p);
                                setProductForm({
                                  name: p.name,
                                  nameEn: p.nameEn || '',
                                  description: p.description,
                                  descriptionEn: p.descriptionEn || '',
                                  price: p.price,
                                  image: p.image,
                                  categoryId: p.categoryId,
                                  available: p.available,
                                  isBest: p.isBest,
                                  tag: p.tag || '',
                                  prepTime: p.prepTime || '',
                                  calories: p.calories || 500,
                                });
                                setIsNewProductModalOpen(true);
                              }}
                              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`هل أنت متأكد من حذف الصنف "${p.name}"؟`)) {
                                  deleteProduct(p.id);
                                  showToast('تم حذف الصنف.');
                                }
                              }}
                              className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900 text-rose-400 transition border border-rose-900"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. CATEGORIES MANAGEMENT TAB */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-black font-['Cairo'] text-stone-100">
              {language === 'ar' ? 'أقسام المنيو' : 'Menu Categories'}
            </h2>

            <button
              type="button"
              onClick={() => {
                setEditingCategory(null);
                setCategoryForm({
                  name: '',
                  nameEn: '',
                  description: '',
                  descriptionEn: '',
                  image: PRESET_FOOD_IMAGES[0].url,
                  background: PRESET_FOOD_IMAGES[0].url,
                  badge: 'جديد',
                  atmosphereTheme: 'grill',
                  displayOrder: categories.length + 1,
                  active: true,
                });
                setIsNewCategoryModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm font-['Cairo'] shadow-lg flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ar' ? 'إضافة قسم جديد' : 'Add Category'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-5 rounded-3xl bg-stone-900 border border-stone-800 space-y-4 relative overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-2xl object-cover border border-stone-700"
                  />
                  <div>
                    <h4 className="font-bold text-stone-100 font-['Cairo'] text-base">{cat.name}</h4>
                    {cat.nameEn && <div className="text-xs text-stone-400 font-['Outfit']">{cat.nameEn}</div>}
                    <div className="text-[11px] text-amber-400 font-bold mt-0.5">
                      {products.filter((p) => p.categoryId === cat.id).length} أصناف
                    </div>
                  </div>
                </div>

                <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed font-['Cairo']">
                  {cat.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-stone-800">
                  <span className="text-xs font-bold text-stone-400">
                    الترتيب: {cat.displayOrder}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCategory(cat);
                        setCategoryForm({
                          name: cat.name,
                          nameEn: cat.nameEn || '',
                          description: cat.description,
                          descriptionEn: cat.descriptionEn || '',
                          image: cat.image,
                          background: cat.background || cat.image,
                          badge: cat.badge || '',
                          atmosphereTheme: cat.atmosphereTheme || 'grill',
                          displayOrder: cat.displayOrder,
                          active: cat.active,
                        });
                        setIsNewCategoryModalOpen(true);
                      }}
                      className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`هل أنت متأكد من حذف القسم "${cat.name}"؟`)) {
                          deleteCategory(cat.id);
                          showToast('تم حذف القسم.');
                        }
                      }}
                      className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900 text-rose-400 transition border border-rose-900"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SETTINGS & WHATSAPP MANAGEMENT TAB */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <div>
              <h2 className="text-xl font-bold font-['Cairo'] text-stone-100">
                {language === 'ar' ? 'إعدادات الموقع ومعلومات التواصل' : 'Restaurant & WhatsApp Settings'}
              </h2>
              <p className="text-xs text-stone-400">
                {language === 'ar'
                  ? 'أي تعديل هنا يظهر فوراً على الموقع وصفحات العملاء بدون تأخير'
                  : 'Changes sync immediately across the live customer website'}
              </p>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm font-['Cairo'] shadow-lg flex items-center gap-2 transition"
            >
              <Save className="w-4 h-4" />
              <span>{language === 'ar' ? 'حفظ التعديلات فوراً' : 'Save Changes'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-['Cairo']">
            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1">اسم المطعم (عربي):</label>
              <input
                type="text"
                value={settingsForm.restaurantName}
                onChange={(e) => setSettingsForm({ ...settingsForm, restaurantName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1">Restaurant Name (English):</label>
              <input
                type="text"
                value={settingsForm.restaurantNameEn}
                onChange={(e) => setSettingsForm({ ...settingsForm, restaurantNameEn: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400 font-['Outfit']"
              />
            </div>

            {/* شعار المطعم (Logo) — يظهر بدل أيقونة اللهب في الهيدر والإنترو */}
            <div className="md:col-span-2 p-4 rounded-2xl bg-stone-950 border border-amber-500/20 space-y-3">
              <label className="text-xs font-bold text-amber-400 block">
                شعار المطعم (Logo) — يظهر في الهيدر بجانب الاسم، وفي إنترو المقدمة بدل أيقونة النار:
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl border border-amber-500/40 bg-stone-900 flex items-center justify-center overflow-hidden shrink-0">
                  {settingsForm.logoUrl ? (
                    <img src={settingsForm.logoUrl} alt="Logo Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  ) : (
                    <Flame className="w-7 h-7 text-amber-500" />
                  )}
                </div>
                <div className="flex-1 flex flex-wrap items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-600 text-xs font-bold text-stone-200 transition">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>رفع شعار من جهازك</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const url = await uploadSiteImage(file, 'site-assets');
                          setSettingsForm((prev) => ({ ...prev, logoUrl: url }));
                          showToast('تم رفع الشعار بنجاح!');
                        } catch (err: any) {
                          showToast(err.message || 'فشل رفع الشعار');
                        } finally {
                          e.target.value = '';
                        }
                      }}
                    />
                  </label>
                  {settingsForm.logoUrl && (
                    <button
                      type="button"
                      onClick={() => setSettingsForm((prev) => ({ ...prev, logoUrl: '' }))}
                      className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold transition"
                    >
                      إزالة الشعار (رجوع لأيقونة النار)
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1">الشارة بجانب اسم المطعم (عربي، مثلاً "مشويات"):</label>
              <input
                type="text"
                value={settingsForm.navBadgeText || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, navBadgeText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1">Header Badge (English):</label>
              <input
                type="text"
                value={settingsForm.navBadgeTextEn || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, navBadgeTextEn: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400 font-['Outfit']"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1">السطر الفرعي تحت الاسم بالهيدر (عربي):</label>
              <input
                type="text"
                value={settingsForm.navSubtitle || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, navSubtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1">Header Subtitle (English):</label>
              <input
                type="text"
                value={settingsForm.navSubtitleEn || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, navSubtitleEn: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400 font-['Outfit']"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-emerald-400 block mb-1">رقم واتساب للطلبات:</label>
              <input
                type="text"
                value={settingsForm.whatsappNumber}
                onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-emerald-500/40 text-xs text-stone-100 focus:outline-none focus:border-emerald-400 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-emerald-400 block mb-1">نص زر الواتساب العائم (CTA):</label>
              <input
                type="text"
                value={settingsForm.whatsappCta}
                onChange={(e) => setSettingsForm({ ...settingsForm, whatsappCta: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-emerald-500/40 text-xs text-stone-100 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1">رقم الهاتف الأساسي:</label>
              <input
                type="text"
                value={settingsForm.phone}
                onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1">رقم الهاتف الإضافي:</label>
              <input
                type="text"
                value={settingsForm.phoneSecondary || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, phoneSecondary: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-stone-300 block mb-1">عنوان المطعم والفرع:</label>
              <input
                type="text"
                value={settingsForm.address}
                onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-stone-300 block mb-1">مواعيد العمل:</label>
              <input
                type="text"
                value={settingsForm.workingHours}
                onChange={(e) => setSettingsForm({ ...settingsForm, workingHours: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-stone-300 block mb-1">نص الفوتر التعريفي:</label>
              <textarea
                rows={3}
                value={settingsForm.footerText}
                onChange={(e) => setSettingsForm({ ...settingsForm, footerText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Announcement Banner */}
            <div className="md:col-span-2 p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-400">شريط الإعلانات والعروض أعلى الموقع:</label>
                <input
                  type="checkbox"
                  checked={settingsForm.announcementActive}
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcementActive: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500"
                />
              </div>
              <input
                type="text"
                value={settingsForm.announcement || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                placeholder="اكتب نص العرض الترويجي..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </form>
      )}

      {/* 5. SOCIAL MEDIA MANAGEMENT TAB */}
      {activeTab === 'social' && (
        <form onSubmit={handleSaveSocial} className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <div>
              <h2 className="text-xl font-bold font-['Cairo'] text-stone-100">
                {language === 'ar' ? 'إدارة بطاقات التواصل الاجتماعي الثلاث' : 'Manage 3 Social Media Cards'}
              </h2>
              <p className="text-xs text-stone-400">
                {language === 'ar' ? 'التحكم في روابط وعناوين منصات التواصل الاجتماعي المعروضة' : 'Configure the 3 active social media cards'}
              </p>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm font-['Cairo'] shadow-lg flex items-center gap-2 transition"
            >
              <Save className="w-4 h-4" />
              <span>{language === 'ar' ? 'حفظ البطاقات' : 'Save Cards'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-['Cairo']">
            {socialForm.map((card, idx) => (
              <div key={card.id} className="p-5 rounded-2xl bg-stone-800/60 border border-stone-700/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">بطاقة رقم {idx + 1} ({card.platform})</span>
                  <input
                    type="checkbox"
                    checked={card.active}
                    onChange={(e) => {
                      const updated = [...socialForm];
                      updated[idx].active = e.target.checked;
                      setSocialForm(updated);
                    }}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">المنصة:</label>
                  <select
                    value={card.platform}
                    onChange={(e) => {
                      const updated = [...socialForm];
                      updated[idx].platform = e.target.value as SocialMediaCard['platform'];
                      setSocialForm(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-stone-200"
                  >
                    <option value="facebook">فيسبوك (Facebook)</option>
                    <option value="instagram">إنستغرام (Instagram)</option>
                    <option value="tiktok">تيك توك (TikTok)</option>
                    <option value="youtube">يوتيوب (YouTube)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">العنوان:</label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => {
                      const updated = [...socialForm];
                      updated[idx].title = e.target.value;
                      setSocialForm(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-stone-200"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">الوصف المختصر:</label>
                  <input
                    type="text"
                    value={card.description}
                    onChange={(e) => {
                      const updated = [...socialForm];
                      updated[idx].description = e.target.value;
                      setSocialForm(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-stone-200"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">رابط الحساب (URL):</label>
                  <input
                    type="text"
                    value={card.url}
                    onChange={(e) => {
                      const updated = [...socialForm];
                      updated[idx].url = e.target.value;
                      setSocialForm(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-stone-200 font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </form>
      )}

      {/* Modal: Add/Edit Product */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-xl overflow-y-auto">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-2xl rounded-3xl bg-stone-900 border border-amber-500/40 p-6 sm:p-8 shadow-2xl text-stone-100 my-auto"
          >
            <button
              type="button"
              onClick={() => setIsNewProductModalOpen(false)}
              className="absolute top-4 left-4 text-stone-400 hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-['Cairo'] text-amber-400 mb-6">
              {editingProduct ? `تعديل صنف: ${editingProduct.name}` : 'إضافة صنف جديد للمنيو'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 font-['Cairo']">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-300 block mb-1">اسم الصنف (عربي):</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-300 block mb-1">Name (English):</label>
                  <input
                    type="text"
                    value={productForm.nameEn}
                    onChange={(e) => setProductForm({ ...productForm, nameEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400 font-['Outfit']"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-300 block mb-1">القسم التابع له:</label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-amber-400 block mb-1">السعر (بالجنيه المصري):</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-amber-500/40 text-xs text-amber-300 font-black focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-300 block mb-1">الوصف ومكونات الصنف:</label>
                <textarea
                  rows={2}
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Image Upload from Device or Preset Selection */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <label className="text-xs font-bold text-amber-400 flex items-center justify-between">
                  <span>صورة الصنف (رفع مباشر من جهازك أو اختيار صورة احترافية):</span>
                </label>

                <div className="flex items-center gap-4">
                  <img
                    src={productForm.image}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-2xl object-cover border border-amber-500/50 shadow-md"
                  />
                  <div className="flex-1 space-y-2">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-600 text-xs font-bold text-stone-200 transition">
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>اختر صورة من جهازك (JPG / PNG / WebP)</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'product')}
                      />
                    </label>
                    <p className="text-[10px] text-stone-400">
                      يتم الرفع المباشر والمعاينة فوراً بدون الحاجة لكتابة روابط URL.
                    </p>
                  </div>
                </div>

                {/* Preset Fast Picker */}
                <div>
                  <span className="text-[11px] text-stone-400 block mb-1">أو اختر صورة جاهزة عالية الدقة:</span>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {PRESET_FOOD_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setProductForm({ ...productForm, image: preset.url })}
                        className={`relative shrink-0 w-12 h-12 rounded-xl overflow-hidden border transition ${
                          productForm.image === preset.url ? 'border-amber-400 scale-105' : 'border-stone-700 opacity-60'
                        }`}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">شارة الصنف (Tag):</label>
                  <input
                    type="text"
                    value={productForm.tag}
                    onChange={(e) => setProductForm({ ...productForm, tag: e.target.value })}
                    placeholder="الأكثر مبيعاً"
                    className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-xs text-stone-200"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">وقت التجهيز:</label>
                  <input
                    type="text"
                    value={productForm.prepTime}
                    onChange={(e) => setProductForm({ ...productForm, prepTime: e.target.value })}
                    placeholder="15 دقيقة"
                    className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-xs text-stone-200"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="p-avail"
                    checked={productForm.available}
                    onChange={(e) => setProductForm({ ...productForm, available: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                  <label htmlFor="p-avail" className="text-xs font-bold text-stone-300">متاح للطلب</label>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="p-best"
                    checked={productForm.isBest}
                    onChange={(e) => setProductForm({ ...productForm, isBest: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                  <label htmlFor="p-best" className="text-xs font-bold text-amber-400">صنف مميز (Best)</label>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm shadow-xl transition"
                >
                  {editingProduct ? 'حفظ التعديلات' : 'إضافة الصنف للمنيو'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewProductModalOpen(false)}
                  className="px-6 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-sm font-bold transition"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal: Add/Edit Category */}
      {isNewCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-xl overflow-y-auto">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-2xl rounded-3xl bg-stone-900 border border-amber-500/40 p-6 sm:p-8 shadow-2xl text-stone-100 my-auto"
          >
            <button
              type="button"
              onClick={() => setIsNewCategoryModalOpen(false)}
              className="absolute top-4 left-4 text-stone-400 hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-['Cairo'] text-amber-400 mb-6">
              {editingCategory ? `تعديل قسم: ${editingCategory.name}` : 'إضافة قسم منيو جديد'}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-4 font-['Cairo']">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-300 block mb-1">اسم القسم (عربي):</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-300 block mb-1">Category Name (English):</label>
                  <input
                    type="text"
                    value={categoryForm.nameEn}
                    onChange={(e) => setCategoryForm({ ...categoryForm, nameEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400 font-['Outfit']"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-300 block mb-1">الوصف التعريفي للقسم:</label>
                <textarea
                  rows={2}
                  required
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Image Upload for Category */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <label className="text-xs font-bold text-amber-400 block">صورة وخلفية القسم:</label>
                <div className="flex items-center gap-4">
                  <img
                    src={categoryForm.image}
                    alt="Category Preview"
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-2xl object-cover border border-amber-500/50"
                  />
                  <div className="flex-1 space-y-2">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-600 text-xs font-bold text-stone-200 transition">
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>رفع صورة القسم من جهازك</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'category')}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <label className="text-xs font-bold text-amber-400 block">خلفية القسم (تظهر خلف عنوان القسم):</label>
                <div className="flex items-center gap-4">
                  <img
                    src={categoryForm.background || categoryForm.image}
                    alt="Category Background Preview"
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-2xl object-cover border border-amber-500/50"
                  />
                  <div className="flex-1 space-y-2">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-600 text-xs font-bold text-stone-200 transition">
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>رفع صورة الخلفية من جهازك</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'categoryBg')}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-300 block mb-1">الشارة المميزة (Badge):</label>
                  <input
                    type="text"
                    value={categoryForm.badge}
                    onChange={(e) => setCategoryForm({ ...categoryForm, badge: e.target.value })}
                    placeholder="الأعلى طلباً"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-stone-100"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-300 block mb-1">ترتيب العرض:</label>
                  <input
                    type="number"
                    value={categoryForm.displayOrder}
                    onChange={(e) => setCategoryForm({ ...categoryForm, displayOrder: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-stone-100"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm shadow-xl transition"
                >
                  {editingCategory ? 'حفظ تعديلات القسم' : 'إضافة القسم'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewCategoryModalOpen(false)}
                  className="px-6 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-sm font-bold transition"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
};
