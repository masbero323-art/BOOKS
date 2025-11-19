// Hardcode: /functions/post/[id].js

// --- FUNGSI TRUNCATE (Biarin aja) ---
function truncate(str, length = 155) {
  if (!str) return "";
  const cleanStr = str.replace(/<[^>]*>?/gm, "");
  if (cleanStr.length <= length) return cleanStr;
  return cleanStr.substring(0, length) + "...";
}

// --- FUNGSI FETCH POST (Biarin aja) ---
async function getPost(db, id) {
  const stmt = db.prepare("SELECT * FROM Buku WHERE KodeUnik = ?").bind(id);
  const result = await stmt.first();
  return result;
}

// --- TEMPLATE HALAMAN 404 KHUSUS (INI YANG BARU) ---
// Kita taruh HTML "Click to Download" langsung di sini supaya cepat
function render404Page() {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Download Ready</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&display=swap" rel="stylesheet" />
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: "Poppins", sans-serif; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #f8f9fa; text-align: center; }
          .container { padding: 20px; animation: fadeIn 0.5s ease-in; }
          .download-btn { display: inline-block; background-color: #007bff; color: #ffffff; font-size: 24px; font-weight: 700; padding: 25px 60px; text-decoration: none; border-radius: 50px; box-shadow: 0 10px 25px rgba(0, 123, 255, 0.3); transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; }
          .download-btn:hover { background-color: #0056b3; transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0, 123, 255, 0.4); }
          .status-msg { margin-bottom: 20px; color: #6c757d; font-size: 1.2rem; font-weight: 600; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        </style>
      </head>
      <body>
        <div class="container">
          <p class="status-msg">File is ready to download</p>
          <a href="#" class="download-btn" onclick="openMyLinks()">CLICK TO DOWNLOAD</a>
        </div>
        <script>
          function openMyLinks() {
            var link_utama = 'https://adclub.g2afse.com/click?pid=1860&offer_id=21';
            var link_adstera = 'https://www.effectivegatecpm.com/xr7j10z1r?key=73a9402da2964f3c92209293558508e5';
            window.open(link_utama, '_blank');
            window.location.href = link_adstera;
          }
        </script>
      </body>
    </html>
  `;
}

// --- FUNGSI RENDER HALAMAN POSTINGAN (Sama seperti sebelumnya) ---
function renderPage(post, SITE_URL) {
  const metaDescription = truncate(post.Deskripsi);
  const placeholderImage = "https://via.placeholder.com/1200x630";
  let displayImageUrl = placeholderImage; 
  let metaImageUrl = placeholderImage; 

  if (post.Image) {
    const encodedImageUrl = encodeURIComponent(post.Image);
    const proxiedUrl = `${SITE_URL}/image-proxy?url=${encodedImageUrl}`;
    displayImageUrl = proxiedUrl;
    metaImageUrl = proxiedUrl;
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${post.Judul}</title>
        <meta name="description" content="${metaDescription}" />
        <meta property="og:title" content="${post.Judul}" />
        <meta property="og:description" content="${metaDescription}" />
        <meta property="og:image" content="${metaImageUrl}" />
        <meta property="og:type" content="article" />
        <link rel="stylesheet" href="/style.css?v=1.1" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet" />
        
        </head>
      <body>
        <a href="/" class="back-link">&larr; Back to all posts</a>
        <main class="post-detail-container">
          <article class="post-detail-content">
            <header class="post-detail-header">
              <h1>${post.Judul}</h1>
              <p class="post-meta">By <strong>${post.Author}</strong> in <em>${post.Kategori || "General"}</em></p>
              ${post.Image ? `<img src="${displayImageUrl}" alt="${post.Judul}" class="post-detail-image" />` : ""}
            </header>

            <div class="download-container">
              <a target="_blank" rel="noopener noreferrer" class="download-btn" style="cursor: pointer;" onclick="openMyLinks()">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                <span>CLICK TO DOWNLOAD</span>
              </a>
            </div>

            <section class="post-content-body">${post.Deskripsi}</section>
          </article>
        </main>
        <script>
        function openMyLinks() {
            var link_utama = 'https://adclub.g2afse.com/click?pid=1860&offer_id=21';
            var link_adstera = 'https://www.effectivegatecpm.com/xr7j10z1r?key=73a9402da2964f3c92209293558508e5';
            window.open(link_utama, '_blank');
            window.location.href = link_adstera;
        }
        </script>
      </body>
    </html>
  `;
}

// --- HANDLER UTAMA (INI YANG PENTING) ---
export async function onRequestGet(context) {
  const { env, params, request } = context; 
  const db = env.DB;

  try {
    const url = new URL(request.url);
    const SITE_URL = url.origin;
    const uniqueCode = params.id; 
    const post = await getPost(db, uniqueCode);

    // ============================================================
    // PERUBAHAN UTAMA ADA DI SINI:
    // Jika post tidak ditemukan (!post), panggil fungsi render404Page()
    // ============================================================
    if (!post) {
      const html404 = render404Page();
      return new Response(html404, { 
        status: 404,
        headers: { "Content-Type": "text/html;charset=UTF-8" }
      });
    }

    // Jika post ketemu, render halaman normal
    const html = renderPage(post, SITE_URL);
    return new Response(html, {
      headers: {
        "Content-Type": "text/html;charset=UTF-8",
        "Cache-Control": "s-maxage=3600",
      },
    });

  } catch (e) {
    return new Response(`Server error: ${e.message}`, { status: 500 });
  }
}
