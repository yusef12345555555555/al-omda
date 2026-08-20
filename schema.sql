-- ====================================================================================
-- مطعم العمدة (AL OMDA RESTAURANT) — SUPABASE DATABASE SCHEMA
-- ====================================================================================
-- هذا الملف يبني قاعدة البيانات بالكامل على Supabase (PostgreSQL).
-- شغّل هذا الملف مرة واحدة بالكامل من: Supabase Dashboard → SQL Editor → New Query
-- (اضغط Run). آمن التشغيل أكثر من مرة (يستخدم IF NOT EXISTS في كل مكان).
--
-- الفكرة المعمارية:
--   1) site_draft      → نسخة "المسودة" التي يعدّل عليها الأدمن (غير ظاهرة للعميل).
--   2) site_published   → النسخة "المنشورة" الوحيدة التي يراها العملاء فعلياً.
--   3) عند الضغط على زر "رفع التعديلات" في لوحة التحكم:
--        site_published.data = site_draft.data  (نسخة كاملة واحدة، كل التعديلات مع بعض)
--        + يُسجَّل صف جديد في publish_history (سجل كل نشرة/إصدار).
--   4) كل المحتوى الذي يراه العميل (الأصناف، الأقسام، الإعدادات، السوشيال ميديا)
--      مخزّن كـ JSON واحد داخل عمود data في كل من الجدولين، لذلك أي حقل نصي/صورة/رابط
--      قابل للتعديل من الأدمن تلقائياً بدون كتابة كود جديد أو تعديل قاعدة البيانات.
-- ====================================================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------------------------------
-- 1) PROFILES — دور المدير (Admin Role)
-- ------------------------------------------------------------------------------------
-- كل مستخدم يُنشأ في Supabase Auth (Authentication) لازم يكون له صف هنا بدور 'admin'
-- عشان يقدر يدخل لوحة التحكم ويعدّل البيانات. العميل العادي مالوش صف هنا أصلاً.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null default 'مدير النظام',
  role text not null default 'admin' check (role in ('admin', 'super_admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_role on public.profiles(role);

-- دالة مساعدة: هل المستخدم الحالي أدمن؟ (تُستخدم داخل كل سياسات RLS بالأسفل)
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
  );
$$;

-- ------------------------------------------------------------------------------------
-- 2) SITE_DRAFT — المسودة (يعدّل عليها الأدمن فقط، لا يراها العميل إطلاقاً)
-- ------------------------------------------------------------------------------------
create table if not exists public.site_draft (
  id int primary key default 1,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id),
  constraint site_draft_single_row check (id = 1)
);

-- ------------------------------------------------------------------------------------
-- 3) SITE_PUBLISHED — النسخة المنشورة (هذا فقط ما يراه العميل)
-- ------------------------------------------------------------------------------------
create table if not exists public.site_published (
  id int primary key default 1,
  data jsonb not null,
  version int not null default 1,
  published_at timestamptz not null default now(),
  published_by uuid references public.profiles(id),
  constraint site_published_single_row check (id = 1)
);

-- ------------------------------------------------------------------------------------
-- 4) PUBLISH_HISTORY — سجل كل عملية "رفع تعديلات" (للمراجعة فقط)
-- ------------------------------------------------------------------------------------
create table if not exists public.publish_history (
  id uuid primary key default gen_random_uuid(),
  version int not null,
  data jsonb not null,
  published_at timestamptz not null default now(),
  published_by uuid references public.profiles(id)
);

create index if not exists idx_publish_history_version on public.publish_history(version desc);

-- ------------------------------------------------------------------------------------
-- 5) MEDIA_LIBRARY — سجل الصور المرفوعة (مكتبة الوسائط في لوحة التحكم)
-- ------------------------------------------------------------------------------------
create table if not exists public.media_library (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'site-media',
  path text not null,
  public_url text not null,
  folder text not null default 'general', -- products / categories / site-assets / backgrounds / social
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create index if not exists idx_media_library_folder on public.media_library(folder);

-- ------------------------------------------------------------------------------------
-- 6) ANALYTICS_EVENTS — إحصائيات زيارات/تفاعل بسيطة (اختياري، للمنيو فقط، بدون كاشير)
-- ------------------------------------------------------------------------------------
create table if not exists public.analytics_events (
  id bigint generated always as identity primary key,
  event_type text not null check (event_type in ('visit', 'whatsapp_click', 'product_view', 'category_view')),
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_analytics_events_type on public.analytics_events(event_type, created_at desc);

-- ====================================================================================
-- ROW LEVEL SECURITY (RLS) — تفعيل الحماية على مستوى قاعدة البيانات
-- ====================================================================================
alter table public.profiles          enable row level security;
alter table public.site_draft        enable row level security;
alter table public.site_published    enable row level security;
alter table public.publish_history   enable row level security;
alter table public.media_library     enable row level security;
alter table public.analytics_events  enable row level security;

-- --- PROFILES: كل أدمن يشوف نفسه فقط + الأدمن يقدر يشوف باقي المديرين ---
drop policy if exists "profiles_select_self_or_admin" on public.profiles;
create policy "profiles_select_self_or_admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

-- --- SITE_DRAFT: القراءة والتعديل للأدمن فقط. العميل لا يصل لها إطلاقاً. ---
drop policy if exists "site_draft_admin_select" on public.site_draft;
create policy "site_draft_admin_select"
  on public.site_draft for select
  using (public.is_admin());

drop policy if exists "site_draft_admin_update" on public.site_draft;
create policy "site_draft_admin_update"
  on public.site_draft for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "site_draft_admin_insert" on public.site_draft;
create policy "site_draft_admin_insert"
  on public.site_draft for insert
  with check (public.is_admin());

-- --- SITE_PUBLISHED: القراءة متاحة للجميع (العميل + الزائر بدون تسجيل دخول). ---
-- --- التعديل (أي نشر) للأدمن فقط. ---
drop policy if exists "site_published_public_select" on public.site_published;
create policy "site_published_public_select"
  on public.site_published for select
  using (true);

drop policy if exists "site_published_admin_update" on public.site_published;
create policy "site_published_admin_update"
  on public.site_published for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "site_published_admin_insert" on public.site_published;
create policy "site_published_admin_insert"
  on public.site_published for insert
  with check (public.is_admin());

-- --- PUBLISH_HISTORY: القراءة والإضافة للأدمن فقط (سجل داخلي). ---
drop policy if exists "publish_history_admin_select" on public.publish_history;
create policy "publish_history_admin_select"
  on public.publish_history for select
  using (public.is_admin());

drop policy if exists "publish_history_admin_insert" on public.publish_history;
create policy "publish_history_admin_insert"
  on public.publish_history for insert
  with check (public.is_admin());

-- --- MEDIA_LIBRARY: كل العمليات للأدمن فقط. ---
drop policy if exists "media_library_admin_all" on public.media_library;
create policy "media_library_admin_all"
  on public.media_library for all
  using (public.is_admin())
  with check (public.is_admin());

-- --- ANALYTICS_EVENTS: أي زائر (حتى بدون تسجيل دخول) يقدر يسجّل حدث فقط (إضافة). ---
-- --- القراءة والتجميع للأدمن فقط. ---
drop policy if exists "analytics_events_public_insert" on public.analytics_events;
create policy "analytics_events_public_insert"
  on public.analytics_events for insert
  with check (true);

drop policy if exists "analytics_events_admin_select" on public.analytics_events;
create policy "analytics_events_admin_select"
  on public.analytics_events for select
  using (public.is_admin());

-- ====================================================================================
-- SEED DATA — تجهيز أول نسخة (مسودة + منشورة) حتى لا يفتح الموقع فارغاً
-- ====================================================================================
insert into public.site_draft (id, data)
values (1, '{
  "settings": {
    "restaurantName": "مطعم العمدة",
    "restaurantNameEn": "AL OMDA Restaurant",
    "tagline": "سر الشوي على الفحم • أصالة الطعم المصري",
    "taglineEn": "Charcoal Grill Secret • Authentic Egyptian Taste",
    "address": "عنوان المطعم — يرجى تحديثه من لوحة التحكم",
    "addressEn": "Restaurant address — please update from admin panel",
    "phone": "01000000000",
    "whatsappNumber": "201000000000",
    "whatsappCta": "اطلب الآن",
    "whatsappCtaEn": "Order Now",
    "footerText": "مطعم العمدة، لحوم بلدية طازجة ومشويات على الفحم الطبيعي بأصالة الطعم المصري.",
    "footerTextEn": "AL OMDA Restaurant, fresh local meat and authentic charcoal grills.",
    "workingHours": "يومياً من 12 ظهراً حتى 2 صباحاً",
    "workingHoursEn": "Daily 12 PM – 2 AM",
    "announcement": "",
    "announcementActive": false,
    "logoUrl": "",
    "navBadgeText": "مشويات",
    "navBadgeTextEn": "Grills",
    "navSubtitle": "أصالة الطعم المصري",
    "navSubtitleEn": "AUTHENTIC CHARCOAL GRILLS"
  },
  "categories": [],
  "products": [],
  "socialMedia": [
    { "id": "sm_instagram", "platform": "instagram", "title": "إنستجرام", "titleEn": "Instagram", "description": "تابعنا لآخر العروض", "descriptionEn": "Follow us", "url": "https://instagram.com", "active": true, "displayOrder": 1 },
    { "id": "sm_facebook", "platform": "facebook", "title": "فيسبوك", "titleEn": "Facebook", "description": "صفحتنا الرسمية", "descriptionEn": "Our page", "url": "https://facebook.com", "active": true, "displayOrder": 2 },
    { "id": "sm_tiktok", "platform": "tiktok", "title": "تيك توك", "titleEn": "TikTok", "description": "فيديوهات المطبخ", "descriptionEn": "Kitchen videos", "url": "https://tiktok.com", "active": true, "displayOrder": 3 }
  ]
}'::jsonb)
on conflict (id) do nothing;

insert into public.site_published (id, data, version)
select id, data, 1 from public.site_draft where id = 1
on conflict (id) do nothing;

-- ====================================================================================
-- STORAGE — تخزين الصور (Supabase Storage)
-- ====================================================================================
-- ننشئ باكت واحد عام اسمه site-media، وبداخله مجلدات منطقية:
--   products/  categories/  backgrounds/  site-assets/  social/
insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;

-- القراءة عامة للجميع (عشان صور المنيو تظهر للعميل بدون تسجيل دخول)
drop policy if exists "site_media_public_read" on storage.objects;
create policy "site_media_public_read"
  on storage.objects for select
  using (bucket_id = 'site-media');

-- الرفع/التعديل/الحذف للأدمن فقط
drop policy if exists "site_media_admin_insert" on storage.objects;
create policy "site_media_admin_insert"
  on storage.objects for insert
  with check (bucket_id = 'site-media' and public.is_admin());

drop policy if exists "site_media_admin_update" on storage.objects;
create policy "site_media_admin_update"
  on storage.objects for update
  using (bucket_id = 'site-media' and public.is_admin());

drop policy if exists "site_media_admin_delete" on storage.objects;
create policy "site_media_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'site-media' and public.is_admin());

-- ====================================================================================
-- تحويل أول مستخدم Auth تقوم بإنشائه يدوياً إلى مدير (Admin)
-- ====================================================================================
-- بعد إنشاء المستخدم من: Supabase Dashboard → Authentication → Users → Add User
-- (بالإيميل وكلمة المرور بتاعة الأدمن)، شغّل الأمر التالي بعد استبدال الإيميل:
--
--   insert into public.profiles (id, email, name, role)
--   select id, email, 'مدير مطعم العمدة', 'super_admin'
--   from auth.users
--   where email = 'admin@example.com'
--   on conflict (id) do nothing;
--
-- (الخطوات الكاملة موجودة في README.md تحت قسم "إعداد Supabase خطوة بخطوة")
-- ====================================================================================
