// Hardcode: /functions/post/[id].js

// --- 1. KONFIGURASI UTAMA ---
const CACHE_TTL = 60 * 60 * 24 * 30; // Simpan Cache selama 30 Hari (Biar hemat fetch)

// --- 2. FUNGSI UTILITY & SPINNING ---
function truncate(str, length = 250) {
  if (!str) return "";
  const cleanStr = str.replace(/<[^>]*>?/gm, "");
  if (cleanStr.length <= length) return cleanStr;
  return cleanStr.substring(0, length) + "...";
}

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateLongDescription(title, author, isbn) {
  const randomSize = (Math.random() * (25 - 2) + 2).toFixed(2);
  const randomPages = Math.floor(Math.random() * (900 - 150) + 150);
  const date = new Date().toISOString().slice(0, 10);

  const part1 = [
    `In the digital age, finding a reliable source for <strong>"${title}"</strong> can be challenging. This work by <strong>${author}</strong> is highly sought after. We provide a secure gateway to access this document for educational and archival purposes.`,
    `We are pleased to archive the digital edition of <strong>"${title}"</strong>. Authored by <strong>${author}</strong>, this document is essential for collectors and researchers. Our repository ensures this file is preserved in high quality.`,
    `Unlock the full content of <strong>"${title}"</strong> by <strong>${author}</strong> (ID: ${isbn}). This file has been processed for maximum compatibility with modern e-readers and tablets.`
  ];

  const part2 = [
    `Readers have praised the depth of content provided by <strong>${author}</strong>. This PDF version retains the original formatting, ensuring you get the authentic experience as intended by the publisher.`,
    `<strong>"${title}"</strong> stands out for its unique perspective. By downloading this copy, you ensure that this valuable knowledge is preserved. The text is clear, crisp, and fully searchable.`,
    `Our community has frequently requested <strong>"${title}"</strong>. We have prioritized this upload to ensure fast and secure access. The file integrity has been verified to be 100% complete.`
  ];

  const part3 = [
    `This file is optimized for size and quality (${randomSize} MB). It is compatible with iOS, Android, and Windows devices. The document contains approximately ${randomPages} pages of high-resolution content.`,
    `Technical details: The PDF for <strong>"${title}"</strong> is compressed without quality loss. With a size of ${randomSize} MB, it is easy to store. The pages (~${randomPages}) have been OCR-scanned for text recognition.`,
    `File Report: Verified ID ${isbn}. Status: Online. The file size is manageable at ${randomSize} MB, perfect for mobile data downloading. It includes the complete unabridged content.`
  ];

  const part4 = [
    `Safety First: This file is hosted on our secure cloud servers. It has passed multiple virus checks and is guaranteed malware-free. Download with confidence.`,
    `Our "Verified Safe" protocol ensures that the link for <strong>"${title}"</strong> is secure. We use SSL encryption to protect your privacy during the download process.`,
    `We do not bundle ad-ware. You are downloading the clean PDF of <strong>"${title}"</strong> by <strong>${author}</strong>. Your device security is our top priority.`
  ];

  const part5 = [
    `Click the button above to start the secure download. You may need to verify you are human to prevent bot abuse. Once verified, access to <strong>"${title}"</strong> is immediate.`,
    `To get your copy, use the "Download Full PDF" link. Due to high demand for <strong>${author}</strong>'s work, a brief verification may be required. This keeps our servers fast for everyone.`,
    `Don't wait. Secure your copy of <strong>"${title}"</strong> today. Registration is free and grants you access to our entire library of millions of documents.`
  ];

  return `
    <p>${getRandomItem(part1)}</p>
    <p>${getRandomItem(part2)}</p>
    <div class="spec-box">
        <h4>Document Properties</h4>
        <ul>
            <li><strong>File Name:</strong> ${title.replace(/[^a-zA-Z0-9]/g, '_')}_Secure.pdf</li>
            <li><strong>Author:</strong> ${author}</li>
            <li><strong>Date:</strong> ${date}</li>
            <li><strong>Size:</strong> ${randomSize} MB</li>
            <li><strong>Pages:</strong> ~${randomPages}</li>
            <li><strong>Status:</strong> <span style="color:green; font-weight:bold;">Available Online</span></li>
        </ul>
    </div>
    <p>${getRandomItem(part3)}</p>
    <p>${getRandomItem(part4)}</p>
    <p>${getRandomItem(part5)}</p>
  `;
}

// --- 3. FUNGSI DATABASE (LOKAL) ---
async function getPost(db, id) {
  const stmt = db.prepare("SELECT * FROM Buku WHERE KodeUnik = ?").bind(id);
  const result = await stmt.first();
  return result;
}

// --- 4. FUNGSI EXTERNAL (OPEN LIBRARY) ---
async function getOpenLibraryData(isbn) {
  try {
    const cleanIsbn = isbn.replace(/[^0-9X]/gi, "");
    // Timeout Controller: Batalkan request jika OL loading lebih dari 3 detik (Hemat CPU Time)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); 

    const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${cleanIsbn}&jscmd=data&format=json`;
    const response = await fetch(url, { 
        headers: { "User-Agent": "CloudflareWorker/1.0" },
        signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) return null;
    const data = await response.json();
    const key = `ISBN:${cleanIsbn}`;
    const bookData = data[key];
    if (!bookData) return null;

    let authorName = "Unknown Author";
    if (bookData.authors && bookData.authors.length > 0) authorName = bookData.authors[0].name;
    const title = bookData.title || "Document Archive";
    const longDescription = generateLongDescription(title, authorName, cleanIsbn);

    let coverUrl = null;
    if (bookData.cover) coverUrl = bookData.cover.large || bookData.cover.medium || bookData.cover.small;

    return {
      Judul: title,
      Deskripsi: longDescription, 
      Image: coverUrl,
      Author: authorName,
      Kategori: "Ebook Archive",
      IsAutoGenerated: true
    };
  } catch (error) {
    return null;
  }
}

// --- 5. RENDERER (HTML) ---
function renderPage(post, SITE_URL) {
  const metaDescription = truncate(post.Deskripsi, 200);
  const placeholderImage = "https://via.placeholder.com/1200x630?text=Secure+Archive";
  let displayImageUrl = placeholderImage; 

  if (post.Image) {
    if (post.Image.startsWith("http")) {
        displayImageUrl = post.Image;
    } else {
        const encodedImageUrl = encodeURIComponent(post.Image);
        displayImageUrl = `${SITE_URL}/image-proxy?url=${encodedImageUrl}`;
    }
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Download ${post.Judul} Full PDF</title>
        <meta name="description" content="${metaDescription}" />
        <meta property="og:title" content="${post.Judul}" />
        <meta property="og:description" content="${metaDescription}" />
        <meta property="og:image" content="${displayImageUrl}" />
        <meta name="robots" content="index, follow" />
        <link rel="stylesheet" href="/style.css?v=1.1" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet" />
        <style>
          .download-container { display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 30px 0; width: 100%; }
          .download-btn { display: flex; align-items: center; justify-content: center; gap: 10px; background-color: #28a745; color: white; font-size: 18px; font-weight: 700; padding: 18px 40px; text-decoration: none; border-radius: 50px; box-shadow: 0 10px 20px rgba(40, 167, 69, 0.3); transition: transform 0.2s; width: 100%; max-width: 450px; text-transform: uppercase; }
          .download-btn:hover { transform: scale(1.02); background-color: #218838; }
          .server-status { margin-top: 15px; font-size: 0.9rem; color: #666; display: flex; gap: 10px; align-items: center; }
          .dot { height: 8px; width: 8px; background-color: #28a745; border-radius: 50%; display: inline-block; }
          .post-detail-image { max-width: 100%; height: auto; max-height: 500px; object-fit: contain; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
          .generated-content { font-size: 1.05rem; line-height: 1.8; color: #333; text-align: left; }
          .generated-content p { margin-bottom: 20px; }
          .spec-box { background: #f1f8e9; border: 1px solid #c8e6c9; padding: 25px; border-radius: 10px; margin: 30px 0; }
          .spec-box h4 { margin-top: 0; margin-bottom: 15px; color: #2e7d32; }
          .spec-box ul { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          @media (max-width: 600px) { .spec-box ul { grid-template-columns: 1fr; } }
        </style>
      </head>
      <body>
        <a href="/" class="back-link">&larr; Library Index</a>
        <main class="post-detail-container">
          <article class="post-detail-content">
            <header class="post-detail-header">
              <h1>${post.Judul}</h1>
              <p class="post-meta">By <strong>${post.Author}</strong></p>
              <img src="${displayImageUrl}" alt="${post.Judul}" class="post-detail-image" onerror="this.style.display='none'" />
            </header>
            <div class="download-container">
              <a href="#" class="download-btn" onclick="openMyLinks()">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                 DOWNLOAD FULL PDF
              </a>
              <div class="server-status"><span class="dot"></span> Secure Server #1 &bull; Verified Safe</div>
            </div>
            <hr style="margin: 40px 0; border: 0; border-top: 1px solid #eee;">
            <section class="post-content-body generated-content">${post.Deskripsi}</section>
          </article>
        </main>
        <script>
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

// --- 6. HANDLER UTAMA DENGAN CACHE API ---
export async function onRequestGet(context) {
  const { env, params, request } = context; 
  
  // A. CEK CACHE CLOUDFLARE (Cache API)
  // Ini kunci agar Free Plan tidak jebol CPU/Waktu
  const cache = caches.default;
  let response = await cache.match(request);

  if (response) {
    // Jika ada di cache, kirim langsung (Hit)
    return response;
  }

  // B. JIKA TIDAK ADA DI CACHE (Miss), JALANKAN PROSES BERAT
  try {
    const url = new URL(request.url);
    const SITE_URL = url.origin;
    const uniqueCode = params.id; 
    
    // 1. Cek DB Lokal
    let post = await getPost(env.DB, uniqueCode);

    if (!post) {
      // 2. Fetch OpenLibrary (Auto Generate)
      const olData = await getOpenLibraryData(uniqueCode);
      if (olData) {
        post = olData;
      } else {
        // 3. Fallback Dummy
        const fakeTitle = "Private Archive Document";
        const fakeDesc = generateLongDescription(fakeTitle, "System Admin", uniqueCode);
        post = { Judul: fakeTitle, Author: "Library System", Kategori: "Restricted", Deskripsi: fakeDesc, Image: null, IsAutoGenerated: true };
      }
    }

    // 4. Render HTML
    const html = renderPage(post, SITE_URL);
    
    // 5. Buat Response Baru
    response = new Response(html, {
      headers: {
        "Content-Type": "text/html;charset=UTF-8",
        // PENTING: Header ini memberitahu Cloudflare untuk menyimpan di Cache
        "Cache-Control": `public, max-age=${CACHE_TTL}, s-maxage=${CACHE_TTL}`,
      },
    });

    // 6. SIMPAN KE CACHE (Asynchronous - tidak memblokir user)
    // context.waitUntil memastikan proses simpan cache berjalan di background
    context.waitUntil(cache.put(request, response.clone()));

    return response;

  } catch (e) {
    return new Response(`Server error: ${e.message}`, { status: 500 });
  }
}
