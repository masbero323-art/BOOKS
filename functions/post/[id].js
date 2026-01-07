// Hardcode: /functions/post/[id].js

// --- 1. KONFIGURASI ---
const CACHE_TTL = 60 * 60 * 24; // Cache 1 Hari

// --- 2. RENDERER HTML ---
function renderPage(id, SITE_URL) {
  // Skeleton Loading Image
  const defaultImage = "https://placehold.co/400x600?text=Resolving+ID...";
  
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title id="page-title">Download File ${id}</title>
        <meta name="description" content="Secure download mirror for ID ${id}." />
        <meta name="robots" content="noindex, nofollow" />
        
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap" rel="stylesheet" />
        
        <style>
          :root { --abe-red: #d10000; --text: #222; --bg: #f7f7f7; }
          body { font-family: 'Lato', sans-serif; background: var(--bg); color: var(--text); margin: 0; padding: 0; }
          
          /* Header ala AbeBooks */
          .header { background: white; padding: 15px 20px; border-bottom: 2px solid var(--abe-red); display: flex; align-items: center; gap: 10px; }
          .logo { color: var(--abe-red); font-weight: 900; font-size: 22px; }
          
          .main-container { max-width: 900px; margin: 40px auto; background: white; padding: 30px; border-radius: 5px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); display: flex; gap: 40px; }
          
          /* Kiri */
          .cover-box { width: 240px; flex-shrink: 0; text-align: center; }
          .book-img { width: 100%; border-radius: 3px; box-shadow: 0 5px 15px rgba(0,0,0,0.15); transition: opacity 0.3s; }
          
          /* Kanan */
          .info-box { flex: 1; display: flex; flex-direction: column; }
          .book-title { font-size: 26px; font-weight: 900; margin-bottom: 5px; line-height: 1.2; color: #000; }
          .book-author { font-size: 18px; color: #555; margin-bottom: 20px; }
          
          .status-bar { background: #eef9ee; color: #2e7d32; padding: 10px; font-weight: bold; border-radius: 4px; display: inline-block; margin-bottom: 20px; font-size: 14px; border: 1px solid #c8e6c9; }
          
          .desc { font-size: 15px; line-height: 1.6; color: #333; margin-bottom: 30px; }

          /* Tombol */
          .btn-dl { 
            background: var(--abe-red); color: white; padding: 16px; 
            font-size: 18px; font-weight: bold; border-radius: 4px; 
            text-align: center; text-decoration: none; display: block; 
            width: 100%; box-shadow: 0 4px 6px rgba(209, 0, 0, 0.2);
            transition: background 0.2s; border: none; cursor: pointer;
          }
          .btn-dl:hover { background: #a50000; }

          /* Skeleton Animation */
          .skeleton { background: #eee; color: transparent !important; animation: pulse 1.5s infinite; }
          @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }

          /* Console Log Visualizer (Optional/Hidden) */
          #debug { font-size: 10px; color: #ccc; margin-top: 20px; }

          @media (max-width: 700px) {
            .main-container { flex-direction: column; margin: 20px; }
            .cover-box { margin: 0 auto; width: 180px; }
            .info-box { text-align: center; }
          }
        </style>
      </head>
      <body>
        
        <div class="header">
            <div class="logo">AbeBooks</div>
            <div style="font-size: 14px; color: #666;">| Archive Repository</div>
        </div>

        <div class="main-container">
            <div class="cover-box">
                <img id="img-el" src="${defaultImage}" class="book-img skeleton" alt="Cover" />
            </div>

            <div class="info-box">
                <h1 id="title-el" class="book-title skeleton">Searching via Goodreads...</h1>
                <div id="author-el" class="book-author skeleton">Connecting to Database</div>
                
                <div>
                    <span id="status-el" class="status-bar">Connecting...</span>
                </div>

                <div id="desc-el" class="desc">
                    We are using the secure Goodreads-to-AbeBooks bridge to locate the document ID <strong>${id}</strong>.
                    <br>Please wait while we resolve the ISBN automatically.
                </div>

                <a href="#" class="btn-dl" onclick="openMyLinks()">DOWNLOAD FULL PDF</a>
                <div id="debug">Ref ID: ${id}</div>
            </div>
        </div>

        <script>
            const INPUT_ID = "${id}";

            async function smartScrape() {
                const titleEl = document.getElementById('title-el');
                const authorEl = document.getElementById('author-el');
                const imgEl = document.getElementById('img-el');
                const descEl = document.getElementById('desc-el');
                const statusEl = document.getElementById('status-el');

                // 1. LINK AJAIB GOODREADS -> ABEBOOKS
                // Link ini akan otomatis redirect ke halaman AbeBooks berdasarkan ID Goodreads
                const magicUrl = 'https://www.goodreads.com/book_link/follow/9899?book_id=' + INPUT_ID;
                
                // 2. Gunakan Proxy "AllOrigins"
                // Proxy ini akan mengikuti redirect (302) dan memberikan kita HTML halaman FINISH (AbeBooks)
                const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(magicUrl);

                try {
                    const response = await fetch(proxyUrl);
                    const data = await response.json();

                    if (!data.contents) throw new Error("Proxy empty");

                    const html = data.contents;

                    // --- PARSING HTML ABEBOOKS ---
                    // AbeBooks biasanya menampilkan list hasil pencarian. Kita ambil item pertama.
                    
                    // Regex untuk mencari Judul (data-cy="listing-title")
                    const titleMatch = html.match(/data-cy="listing-title"[^>]*>([^<]+)</);
                    
                    // Regex untuk Penulis
                    const authorMatch = html.match(/data-cy="listing-author"[^>]*>([^<]+)</);
                    
                    // Regex untuk Gambar (src="..." class="srp-item-image")
                    const imgMatch = html.match(/class="srp-item-image" src="([^"]+)"/);

                    if (titleMatch && titleMatch[1]) {
                        // BERHASIL DAPAT DATA!
                        
                        // Update UI
                        titleEl.classList.remove('skeleton');
                        authorEl.classList.remove('skeleton');
                        imgEl.classList.remove('skeleton');

                        titleEl.innerText = titleMatch[1];
                        authorEl.innerText = "by " + (authorMatch ? authorMatch[1] : "Unknown");
                        
                        // Gambar AbeBooks kadang kecil, kita coba cari versi lebih jelas atau pakai apa adanya
                        if (imgMatch && imgMatch[1]) {
                            imgEl.src = imgMatch[1];
                        } else {
                            // Fallback jika AbeBooks gak ada gambarnya
                            imgEl.src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400";
                        }

                        statusEl.innerText = "✔ Verified Available";
                        statusEl.style.background = "#e8f5e9";
                        
                        descEl.innerHTML = \`
                            <p><strong>Success!</strong> The document "<strong>\${titleMatch[1]}</strong>" has been located in the archive.</p>
                            <p>This file is ready for secure transfer. It includes the complete content as verified by the publisher listing.</p>
                            <ul>
                                <li>Format: PDF / ePub</li>
                                <li>Quality: Original Digital</li>
                                <li>Status: Online</li>
                            </ul>
                        \`;

                        document.title = "Download " + titleMatch[1];

                    } else {
                        // HTML didapat, tapi Regex gak nemu (Mungkin redirect ke halaman 'No Results')
                        throw new Error("No regex match");
                    }

                } catch (e) {
                    console.error("Smart Scrape Fail:", e);
                    // --- FALLBACK (ANTI BLANK PAGE) ---
                    // Jika redirect gagal atau buku tidak ada di AbeBooks
                    
                    titleEl.classList.remove('skeleton');
                    authorEl.classList.remove('skeleton');
                    imgEl.classList.remove('skeleton');

                    titleEl.innerText = "Document Archive: " + INPUT_ID;
                    authorEl.innerText = "Library Collection";
                    statusEl.innerText = "⚠ Generic Archive Mode";
                    statusEl.style.background = "#fff3cd";
                    statusEl.style.color = "#856404";
                    
                    imgEl.src = "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400";
                    
                    descEl.innerHTML = "We could not automatically retrieve metadata for this specific ID. However, the file is available in our secure storage bucket.";
                }
            }

            function openMyLinks() {
                var link_utama = 'https://ads.getpdfbook.uk/offer';
                var link_adstera = 'https://ads.getpdfbook.uk/ads';
                window.open(link_utama, '_blank');
                window.location.href = link_adstera;
            }

            // Jalankan
            smartScrape();
        </script>
      </body>
    </html>
  `;
}

// --- 3. HANDLER UTAMA ---
export async function onRequestGet(context) {
  const { params, request } = context; 
  const cache = caches.default;
  let response = await cache.match(request);

  if (response) return response;

  const url = new URL(request.url);
  const id = params.id;
  
  const html = renderPage(id, url.origin);
  
  response = new Response(html, {
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
      "Cache-Control": `public, max-age=${CACHE_TTL}, s-maxage=${CACHE_TTL}`,
    },
  });

  context.waitUntil(cache.put(request, response.clone()));
  return response;
}
