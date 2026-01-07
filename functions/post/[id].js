// Hardcode: /functions/post/[id].js

// --- 1. KONFIGURASI ---
const CACHE_TTL = 60 * 60 * 24 * 7; // Cache 7 Hari (Cukup lama karena data buku jarang berubah)

// --- 2. UTILITY & FAKE STATS (Agar terlihat ramai) ---
function generateStats() {
    return {
        rating: (Math.random() * (4.8 - 3.9) + 3.9).toFixed(2), // Rating tinggi
        votes: Math.floor(Math.random() * (150000 - 5000) + 5000).toLocaleString(),
        reviews: Math.floor(Math.random() * (10000 - 500) + 500).toLocaleString(),
        pages: Math.floor(Math.random() * (900 - 250) + 250),
        year: Math.floor(Math.random() * (2025 - 2020) + 2020), // Fokus buku baru
        size: (Math.random() * (12 - 2) + 2).toFixed(2)
    };
}

// Cover cadangan jika Goodreads gagal total (Jaring Pengaman)
function getRandomFallbackCover() {
    const covers = [
        "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=400&h=600",
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400&h=600",
        "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400&h=600"
    ];
    return covers[Math.floor(Math.random() * covers.length)];
}

// --- 3. THE SCRAPER (INTI DARI SCRIPT INI) ---
async function fetchGoodreadsLive(id) {
    const cleanId = id.trim();
    const targetUrl = `https://www.goodreads.com/book/show/${cleanId}`;
    
    // Default Data (Jika Scrape Gagal)
    let data = {
        title: `Document ID ${cleanId}`,
        author: "Archived Author",
        image: getRandomFallbackCover(),
        description: "This document has been archived securely in our repository. Download availability is guaranteed.",
        isScraped: false
    };

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000); // Max 4 detik loading

        // Kita menyamar sebagai Browser Chrome asli agar tidak diblokir Goodreads
        const response = await fetch(targetUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5"
            },
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
            const html = await response.text();
            
            // --- REGEX MAGIC (Mengambil Meta Tags) ---
            
            // 1. Ambil Judul (og:title)
            // Format biasanya: "Judul Buku (Series, #1) by Penulis"
            const titleMatch = html.match(/<meta property="og:title" content="([^"]*)"/);
            
            // 2. Ambil Gambar (og:image)
            const imageMatch = html.match(/<meta property="og:image" content="([^"]*)"/);
            
            // 3. Ambil Deskripsi (og:description)
            const descMatch = html.match(/<meta property="og:description" content="([^"]*)"/);

            if (titleMatch && titleMatch[1]) {
                let fullTitle = titleMatch[1];
                
                // Pisahkan Judul dan Penulis (Biasanya dipisah kata " by ")
                let author = "Famous Author";
                let title = fullTitle;
                
                // Coba split " by " (Goodreads format standar)
                if (fullTitle.includes(" by ")) {
                    const parts = fullTitle.split(" by ");
                    author = parts[parts.length - 1]; // Ambil bagian paling belakang sebagai nama
                    title = parts.slice(0, parts.length - 1).join(" by "); // Gabung sisanya sebagai judul
                } else if (fullTitle.includes(" by: ")) { // Kadang formatnya begini
                     const parts = fullTitle.split(" by: ");
                     author = parts[1];
                     title = parts[0];
                }

                data.title = title;
                data.author = author;
                data.isScraped = true;
            }

            if (imageMatch && imageMatch[1]) {
                data.image = imageMatch[1];
            }

            if (descMatch && descMatch[1]) {
                // Bersihkan deskripsi dari HTML entities dasar jika ada
                data.description = descMatch[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&');
            } else {
                 data.description = `A popular book by ${data.author}. Currently trending in our database.`;
            }
        }

    } catch (e) {
        console.log("Scraping Error:", e.message);
        // Tetap lanjut menggunakan Default Data (Fallback)
        // Jadi halaman tidak akan pernah blank
    }

    return data;
}

// --- 4. RENDERER (TAMPILAN UI) ---
function renderPage(post, SITE_URL) {
  const stats = generateStats();

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Download ${post.title} PDF - Free Archive</title>
        <meta name="description" content="Read or Download ${post.title} by ${post.author}. Full PDF available." />
        
        <meta property="og:title" content="${post.title}" />
        <meta property="og:image" content="${post.image}" />
        <meta name="robots" content="noindex, nofollow" />
        
        <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@300;700;900&family=Lato:wght@400;700&display=swap" rel="stylesheet" />
        
        <style>
          :root { --primary: #372213; --accent: #009688; --bg: #fdfbf7; }
          body { font-family: 'Lato', sans-serif; background: var(--bg); color: #333; margin: 0; padding: 0; min-height: 100vh; display: flex; flex-direction: column; }
          
          /* Header Simple */
          .header { background: #fff; border-bottom: 1px solid #e1dcd7; padding: 15px 0; text-align: center; }
          .logo { font-family: 'Merriweather', serif; font-weight: 900; font-size: 24px; color: var(--primary); letter-spacing: -1px; }

          /* Main Container */
          .main { flex: 1; max-width: 900px; margin: 30px auto; padding: 20px; width: 100%; box-sizing: border-box; }
          .book-card { display: flex; gap: 40px; background: transparent; }
          
          /* Kiri: Gambar */
          .cover-wrapper { width: 260px; flex-shrink: 0; position: relative; }
          .book-cover { width: 100%; border-radius: 5px; box-shadow: 0 10px 25px rgba(0,0,0,0.15); transition: transform 0.3s; }
          .book-cover:hover { transform: translateY(-5px); }
          
          /* Kanan: Info */
          .info-wrapper { flex: 1; }
          .book-title { font-family: 'Merriweather', serif; font-size: 32px; color: var(--primary); margin: 0 0 5px 0; line-height: 1.2; }
          .book-author { font-size: 18px; color: #666; margin-bottom: 20px; }
          
          /* Stats Bar */
          .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 25px; padding: 15px; background: #fff; border: 1px solid #eee; border-radius: 8px; text-align: center; }
          .stat-val { font-weight: bold; font-size: 16px; color: #333; }
          .stat-label { font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 3px; }

          /* Description */
          .desc { font-size: 16px; line-height: 1.7; color: #444; margin-bottom: 30px; font-family: 'Merriweather', serif; }

          /* BUTTONS - AGC GOAL */
          .btn-group { display: flex; flex-direction: column; gap: 12px; }
          .btn { display: block; width: 100%; text-align: center; padding: 18px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 18px; transition: all 0.2s; cursor: pointer; border: none; }
          
          .btn-primary { background: #d32f2f; color: white; box-shadow: 0 4px 15px rgba(211, 47, 47, 0.3); }
          .btn-primary:hover { background: #b71c1c; transform: scale(1.02); }
          
          .btn-secondary { background: #fff; color: #333; border: 2px solid #ddd; }
          .btn-secondary:hover { background: #f5f5f5; }

          /* Responsive */
          @media (max-width: 768px) {
            .book-card { flex-direction: column; align-items: center; }
            .cover-wrapper { width: 180px; }
            .info-wrapper { text-align: center; }
            .book-title { font-size: 24px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
            <div class="logo">LibraryArchive</div>
        </div>

        <div class="main">
            <div class="book-card">
                <div class="cover-wrapper">
                    <img src="${post.image}" class="book-cover" alt="${post.title}" onerror="this.src='https://placehold.co/400x600?text=Cover+Not+Found'"/>
                    
                    <div style="margin-top: 20px; text-align: center; font-size: 13px; color: #888;">
                        ID: ${Math.floor(Math.random() * 999999)}<br>
                        Status: <span style="color: green; font-weight: bold;">Online</span>
                    </div>
                </div>

                <div class="info-wrapper">
                    <h1 class="book-title">${post.title}</h1>
                    <div class="book-author">by <strong>${post.author}</strong></div>

                    <div class="stats-grid">
                        <div>
                            <div class="stat-val">⭐ ${stats.rating}/5</div>
                            <div class="stat-label">Rating</div>
                        </div>
                        <div>
                            <div class="stat-val">${stats.pages}</div>
                            <div class="stat-label">Pages</div>
                        </div>
                        <div>
                            <div class="stat-val">${stats.year}</div>
                            <div class="stat-label">Year</div>
                        </div>
                    </div>

                    <div class="desc">
                        <p>${truncate(post.description, 400)}</p>
                    </div>

                    <div class="btn-group">
                        <button class="btn btn-primary" onclick="openMyLinks()">
                            DOWNLOAD PDF (${stats.size} MB)
                        </button>
                        <button class="btn btn-secondary" onclick="openMyLinks()">
                            READ ONLINE
                        </button>
                    </div>
                    
                    <p style="margin-top: 15px; font-size: 12px; color: #999; text-align: center;">
                        Secured by SSL. No registration required for guest downloads.
                    </p>
                </div>
            </div>
        </div>

        <script>
        function truncate(str, n){
          return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
        }

        function openMyLinks() {
            var link_utama = 'https://ads.getpdfbook.uk/offer';
            var link_adstera = 'https://ads.getpdfbook.uk/ads';
            window.open(link_utama, '_blank');
            window.location.href = link_adstera;
        }
        </script>
      </body>
    </html>
  `;
}

// --- 5. UTILS ---
function truncate(str, length = 250) {
    if (!str) return "";
    const cleanStr = str.replace(/<[^>]*>?/gm, "");
    if (cleanStr.length <= length) return cleanStr;
    return cleanStr.substring(0, length) + "...";
}

// --- 6. HANDLER UTAMA ---
export async function onRequestGet(context) {
  const { params, request } = context; 
  const cache = caches.default;
  
  // Cek Cache (Agar tidak terlalu sering nembak ke Goodreads)
  let response = await cache.match(request);
  if (response) return response;

  try {
    const url = new URL(request.url);
    const SITE_URL = url.origin;
    const goodreadsId = params.id; 
    
    // FETCH LIVE DATA DARI GOODREADS
    const postData = await fetchGoodreadsLive(goodreadsId);

    const html = renderPage(postData, SITE_URL);
    
    response = new Response(html, {
      headers: {
        "Content-Type": "text/html;charset=UTF-8",
        "Cache-Control": `public, max-age=${CACHE_TTL}, s-maxage=${CACHE_TTL}`,
      },
    });

    context.waitUntil(cache.put(request, response.clone()));
    return response;
  } catch (e) {
    return new Response(`Server error: ${e.message}`, { status: 500 });
  }
}
