import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

// ============================================================================
// خادم بسيط جداً فقط لتشغيل/تقديم الموقع (Static/Dev Server).
// لا يوجد هنا أي API أو قاعدة بيانات محلية — كل البيانات الآن تُقرأ وتُكتب
// مباشرة من المتصفح إلى Supabase (راجع src/lib/supabaseClient.ts).
// هذا الملف موجود فقط لتشغيل Vite في وضع التطوير، أو لتقديم ملفات dist/
// الجاهزة بعد أمر "npm run build" في الاستضافة (Node hosting اختياري؛
// يمكنك بدلاً منه رفع مجلد dist/ مباشرة على Netlify/Vercel/Cloudflare Pages).
// ============================================================================

const app = express();
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // أي مسار غير موجود (مثل /admin) يرجع index.html عشان الـ SPA routing يشتغل صح
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AL OMDA website running on http://localhost:${PORT}`);
  });
}

startServer();
