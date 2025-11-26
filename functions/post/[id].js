// Hardcode: /functions/post/[id].js

// --- 1. FUNGSI UTILITY ---
function truncate(str, length = 200) {
  if (!str) return "";
  const cleanStr = str.replace(/<[^>]*>?/gm, "");
  if (cleanStr.length <= length) return cleanStr;
  return cleanStr.substring(0, length) + "...";
}

// Helper untuk mengambil item acak dari array
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// --- 2. FUNGSI TEXT SPINNING (TEMPLATE GENERATOR) ---
function generateSpunDescription(title, author, isbn) {
  // Database Kata-kata (Sinonim)
  const intros = [
    "You are currently viewing the detail page for",
    "Here you can download the full version of",
    "Get instant access to",
    "Read the complete digital edition of",
    "Download the unabridged ebook of"
  ];
  
  const formats = [
    "PDF and ePub formats",
    "high-quality PDF",
    "digital scanned copy",
    "electronic document format",
    "mobile-friendly ebook format"
  ];
  
  const actions = [
    "available for direct download",
    "ready to be read online",
    "uploaded for archival purposes",
    "accessible for registered members",
    "stored in our secure library"
  ];

  const qualities = [
    "This file has been verified for quality.",
    "The content is scanned from the original edition.",
    "Fully optimized for reading on tablets and smartphones.",
    "Complete with original illustrations and references.",
    "Clean digital copy with searchable text."
  ];

  const connectives = [
    "Written by the renowned author",
    "Authored by",
    "A masterpiece by",
    "From the desk of",
    "Created by"
  ];

  const sources = [
    "Open Library Archive",
    "Public Digital Repository",
    "Global Book Index",
    "Universal Document Library"
  ];

  // Random Data Generator (Biar terlihat teknis)
  const randomSize = (Math.random() * (15 - 2) + 2).toFixed(1); // 2.0MB - 15.0MB
  const randomPages = Math.floor(Math.random() * (800 - 150) + 150); // 150 - 800 pages

  // --- MERAKIT KALIMAT (SPINNING) ---
  
  // Paragraf 1: Intro & Availability
  const sentence1 = `${getRandomItem(intros)} <strong>"${title}"</strong>.`;
  const sentence2 = `${getRandomItem(connectives)} <strong>${author}</strong>, this document is ${getRandomItem(actions)} in ${getRandomItem(formats)}.`;
  
  // Paragraf 2: Technical Specs (Metadata)
  const sentence3 = `
    <br><br>
    <strong>Document Details:</strong><br>
    - <strong>Title:</strong> ${title}<br>
    - <strong>Author:</strong> ${author}<br>
    - <strong>ISBN/ID:</strong> ${isbn}<br>
    - <strong>File Size:</strong> ${randomSize} MB<br>
    - <strong>Pages:</strong> ${randomPages} pages (approx)<br>
    - <strong>Source:</strong> ${getRandomItem(sources)}<br>
  `;

  // Paragraf 3: Closing & Verification
  const sentence4 = `<br>${getRandomItem(qualities)} Please follow the instructions to verify your access and download the full document.`;

  return `${sentence1} ${sentence2} ${sentence3} ${sentence4}`;
}

// --- 3. FUNGSI DATABASE (LOKAL) ---
async function getPost(db, id) {
  const stmt = db.prepare("SELECT * FROM Buku WHERE KodeUnik = ?").bind(id);
  const result = await stmt.first();
  return result;
}

// --- 4. FUNGSI EXTERNAL: AUTO GENERATE DARI OPENLIBRARY ---
async function getOpenLibraryData(isbn) {
  try {
    const cleanIsbn = isbn.replace(/[^0-9X]/gi, "");
    
    // Request ke OpenLibrary
    const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${cleanIsbn}&jscmd=data&format=json`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": "CloudflareWorker/1.0" }
    });

    if (!response.ok) return null;

    const data = await response.json();
    const key = `ISBN:${cleanIsbn}`;
    const bookData = data[key];

    if (!bookData) return null;

    // --- MAPPING DATA ---
    
    let authorName = "Unknown Author";
    if (bookData.authors && bookData.authors.length > 0) {
      authorName = bookData.authors[0].name;
    }
    const title = bookData.title || "Document Archive";

    // 1. Ambil Deskripsi Asli (Kalau ada)
    let realDescription = "";
    if (bookData.excerpts && bookData.excerpts.length > 0) {
      realDescription = bookData.excerpts[0].text;
    } else if (bookData.notes) {
      realDescription = typeof bookData.notes === 'string' ? bookData.notes : bookData.notes.value;
    }

    // 2. Generate Template Text (Spinning)
    const templateText = generateSpunDescription(title, authorName, cleanIsbn);

    // 3. Gabungkan: Deskripsi Asli (jika ada) + Template Text
    // Jika deskripsi asli pendek, template text sangat membantu.
    let finalDescription;
    if (realDescription.length > 50) {
        finalDescription = `<p>${realDescription}</p><hr>${templateText}`;
    } else {
        finalDescription = templateText;
    }

    // Ambil Cover
    let coverUrl = null;
    if (bookData.cover) {
      coverUrl = bookData.cover.large || bookData.cover.medium || bookData.cover.small;
    }

    return {
      Judul: title,
      Deskripsi: finalDescription, // Isi gabungan
      Image: coverUrl,
      Author: authorName,
      Kategori: "Public Archive",
      IsAutoGenerated: true
    };

  } catch (error) {
    return null;
  }
}

// ====================================================================
// TEMPLATE HALAMAN (RENDERER)
// ====================================================================
function renderPage(post, SITE_URL) {
  // Untuk meta description, kita bersihkan HTML tags dari spun text dan ambil 200 char pertama
  const metaDescription = truncate(post.Deskripsi, 250);
  
  const placeholderImage = "https://via.placeholder.com/1200x630?text=Secure+Document";
  let displayImageUrl = placeholderImage; 
  let metaImageUrl = placeholderImage; 

  if (post.Image) {
    if (post.Image.startsWith("http")) {
        displayImageUrl = post.Image;
        metaImageUrl = post.Image;
    } else {
        const encodedImageUrl = encodeURIComponent(post.Image);
        const proxiedUrl = `${SITE_URL}/image-proxy?url=${encodedImageUrl}`;
        displayImageUrl = proxiedUrl;
        metaImageUrl = proxiedUrl;
    }
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Download ${post.Judul} - PDF Free</title>
        <meta name="description" content="${metaDescription}" />
        <meta property="og:title" content="${post.Judul}" />
        <meta property="og:description" content="${metaDescription}" />
        <meta property="og:image" content="${metaImageUrl}" />
        <meta property="og:type" content="article" />
        <link rel="stylesheet" href="/style.css?v=1.1" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet" />
        <style>
          .post-detail-image { 
            max-width: 100%; height: auto; max-height: 450px; 
            object-fit: contain; margin-bottom: 20px; 
            border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          }
          .generated-content p { margin-bottom: 15px; line-height: 1.6; }
          .generated-content ul { margin-bottom: 15px; padding-left: 20px; }
          .spec-box { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <a href="/" class="back-link">&larr; Back to Library</a>
        <main class="post-detail-container">
          <article class="post-detail-content">
            <header class="post-detail-header">
              <h1>${post.Judul}</h1>
              <p class="post-meta">By <strong>${post.Author}</strong></p>
              <img src="${displayImageUrl}" alt="${post.Judul}" class="post-detail-image" onerror="this.style.display='none'" />
            </header>

            <div class="download-container">
              <a href="#" class="download-btn" onclick="openMyLinks()" style="cursor: pointer; background-color: #28a745; border-color: #28a745; display:block; text-align:center; padding: 18px; border-radius: 50px; color:white; font-weight:bold; text-decoration:none; box-shadow: 0 4px 10px rgba(40, 167, 69, 0.3);">
                <span style="display:flex; align-items:center; justify-content:center; gap:10px; font-size: 1.1em;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    DOWNLOAD FULL PDF
                </span>
              </a>
              <p style="text-align:center; font-size:0.85em; color:#666; margin-top:10px;">
                Secure Server #1 &bull; Verified Safe &bull; Fast Speed
              </p>
            </div>

            <hr style="margin: 30px 0; border: 0; border-top: 1px solid #eee;">

            <section class="post-content-body generated-content">
              ${post.Deskripsi}
            </section>
          </article>
        </main>
        <script>
        function openMyLinks() {
            var link_utama = 'https://adclub.g2afse.com/click?pid=1860&offer_id=21';
            var link_adstera = 'https://flourishexcellent.com/xr7j10z1r?key=73a9402da2964f3c92209293558508e5';
            window.open(link_utama, '_blank');
            window.location.href = link_adstera;
        }
        </script>
      </body>
    </html>
  `;
}

// --- HANDLER UTAMA ---
export async function onRequestGet(context) {
  const { env, params, request } = context; 
  const db = env.DB;

  try {
    const url = new URL(request.url);
    const SITE_URL = url.origin;
    const uniqueCode = params.id; 
    
    let post = await getPost(db, uniqueCode);

    if (!post) {
      // 1. Coba Generate dari OpenLibrary
      const olData = await getOpenLibraryData(uniqueCode);
      
      if (olData) {
        post = olData;
      } else {
        // 2. Fallback Jika Gagal Total (Generate Dummy Content)
        // Tetap menggunakan spinning agar tidak terlihat error
        const fakeTitle = "Protected Document Archive";
        const fakeDesc = generateSpunDescription(fakeTitle, "System Administrator", uniqueCode);
        
        post = {
            Judul: fakeTitle,
            Author: "Library System",
            Kategori: "Restricted",
            Deskripsi: fakeDesc,
            Image: null,
            IsAutoGenerated: true
        };
      }
    }

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
