import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft, ArrowRight, Flame } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminLoginPage: React.FC = () => {
  const { adminLogin, setCurrentView, language } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage(language === 'ar' ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Email and password are required');
      return;
    }

    setIsLoading(true);
    try {
      const res = await adminLogin(email, password);
      if (!res.success) {
        setErrorMessage(res.error || (language === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password'));
      }
    } catch (err: any) {
      setErrorMessage(err.message || (language === 'ar' ? 'فشل الاتصال بالخادم' : 'Failed to connect to server'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToCustomer = () => {
    setCurrentView('home');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-4 relative overflow-hidden" id="admin-login-page">
      
      {/* Background ambient lighting */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md bg-gradient-to-b from-stone-900/95 via-stone-900/90 to-stone-950/95 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl relative z-10"
      >
        {/* Back to public menu button */}
        <button
          type="button"
          onClick={handleBackToCustomer}
          className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-400 transition mb-6 font-['Cairo']"
        >
          <ArrowRight className="w-4 h-4 rtl:rotate-0 rotate-180" />
          <span>{language === 'ar' ? 'العودة للموقع الرئيسي' : 'Back to Main Menu'}</span>
        </button>

        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-stone-900 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.25)]">
            <ShieldCheck className="w-8 h-8 animate-pulse" />
          </div>

          <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-black uppercase tracking-wider mb-1 font-['Cairo']">
            <Flame className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'بوابة إدارة مطعم العمدة' : 'AL OMDA RESTAURANT ADMIN'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-['Cairo'] text-stone-100">
            {language === 'ar' ? 'تسجيل دخول الإدارة' : 'Administrator Sign In'}
          </h1>
          <p className="text-xs text-stone-400 mt-1 font-['Cairo']">
            {language === 'ar'
              ? 'يرجى إدخال بيانات حساب المدير المصرح له للوصول لقاعدة البيانات'
              : 'Enter authenticated admin credentials to manage menu and database'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-bold font-['Cairo'] flex items-center gap-2.5 shadow-md"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-['Cairo']">
          
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-300">
              {language === 'ar' ? 'البريد الإلكتروني للإدارة:' : 'Admin Email:'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-stone-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@alomda.com"
                required
                className="w-full ps-10 pe-4 py-3 rounded-2xl bg-stone-900/90 border border-stone-700/80 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-300">
              {language === 'ar' ? 'كلمة المرور المشفرة:' : 'Admin Password:'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-stone-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full ps-10 pe-11 py-3 rounded-2xl bg-stone-900/90 border border-stone-700/80 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 end-0 pe-3.5 flex items-center text-stone-400 hover:text-stone-200 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 font-black text-sm font-['Cairo'] shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-[0.98] transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>{language === 'ar' ? 'تسجيل الدخول الآمن' : 'Secure Login'}</span>
              </>
            )}
          </button>

        </form>

        {/* Security Notice */}
        <div className="mt-8 pt-6 border-t border-stone-800/80 text-center">
          <p className="text-[11px] text-stone-400 font-['Cairo'] leading-relaxed">
            🛡️ {language === 'ar'
              ? 'هذه المنطقة مخصصة للإدارة فقط، ومحمية عبر Supabase Auth وقواعد أمان على مستوى قاعدة البيانات (RLS).'
              : 'Protected administration endpoint secured by Supabase Auth and database-level Row Level Security.'}
          </p>
        </div>

      </motion.div>

    </div>
  );
};
