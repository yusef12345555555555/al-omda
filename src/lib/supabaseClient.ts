import { createClient } from '@supabase/supabase-js';

// ============================================================================
// SUPABASE CLIENT — يُستخدم من المتصفح مباشرة (Anon/Public Key فقط).
// كل الحماية الفعلية موجودة في قاعدة البيانات نفسها (Row Level Security)
// وليس في هذا الملف، فلا مشكلة أن هذا المفتاح يكون ظاهراً في كود الواجهة.
//
// ⚠️ لا تضع أبداً الـ Service Role Key هنا أو في أي كود Frontend.
// ============================================================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    '[Supabase] VITE_SUPABASE_URL أو VITE_SUPABASE_ANON_KEY غير موجودين في .env — راجع README.md.'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// اسم الباكت الموحّد لكل صور الموقع (تم إنشاؤه في schema.sql)
export const MEDIA_BUCKET = 'site-media';

/**
 * يرفع صورة من جهاز الأدمن مباشرة إلى Supabase Storage ويرجّع رابط عام (Public URL)
 * جاهز للتخزين داخل بيانات المنتج/القسم/الإعدادات.
 */
export async function uploadSiteImage(file: File, folder: 'products' | 'categories' | 'backgrounds' | 'site-assets' | 'social'): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (uploadError) {
    throw new Error(uploadError.message || 'فشل رفع الصورة');
  }

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);

  // سجل الصورة في مكتبة الوسائط (لا يوقف الرفع لو فشل هذا الجزء فقط)
  const { data: userData } = await supabase.auth.getUser();
  await supabase.from('media_library').insert({
    bucket: MEDIA_BUCKET,
    path,
    public_url: data.publicUrl,
    folder,
    uploaded_by: userData.user?.id,
  }).then(() => {}, () => {});

  return data.publicUrl;
}
