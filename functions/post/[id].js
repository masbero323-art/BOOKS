// Hardcode: /functions/post/[id].js

// --- 1. FUNGSI UTILITY ---
function truncate(str, length = 250) {
  if (!str) return "";
  const cleanStr = str.replace(/<[^>]*>?/gm, "");
  if (cleanStr.length <= length) return cleanStr;
  return cleanStr.substring(0, length) + "...";
}

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// --- 2. FUNGSI TEXT SPINNING (ADVANCED 500 WORDS GENERATOR) ---
function generateLongDescription(title, author, isbn) {
  const randomSize = (Math.random() * (25 - 2) + 2).toFixed(2);
  const randomPages = Math.floor(Math.random() * (900 - 150) + 150);
  const date = new Date().toISOString().slice(0, 10);

  // --- BAGIAN 1: INTRO (Paragraf Pembuka) ---
  const part1 = [
    `In the ever-evolving world of digital literature, finding a reliable source for <strong>"${title}"</strong> can be quite a challenge. This masterpiece by <strong>${author}</strong> has captured the attention of readers worldwide. We are proud to present a comprehensive digital archive that allows you to access this significant work. Whether you are a student, a researcher, or an avid reader, having access to high-quality PDF versions of such texts is essential for your personal library.`,
    `We are thrilled to announce the availability of the digital edition of <strong>"${title}"</strong>. Authored by the brilliant <strong>${author}</strong>, this book has been a topic of discussion among literary circles. Our repository aims to provide a seamless download experience for this specific title. In an age where information is key, we ensure that this document is preserved and made accessible to our registered members in the highest quality possible.`,
    `Discover the full depth of <strong>"${title}"</strong> by <strong>${author}</strong> through our exclusive digital library. This document, identified by ID ${isbn}, represents a crucial addition to our collection. Many users have been searching for a clean, complete, and unabridged version of this text. We have processed this file to ensure it meets the highest standards of digital archiving, making it ready for immediate access upon registration.`
  ];

  // --- BAGIAN 2: CONTENT REVIEW / GENERIC PRAISE (Paragraf Isi) ---
  const part2 = [
    `The narrative constructed in this book offers a unique perspective that is both engaging and thought-provoking. Critics and readers alike have praised the way <strong>${author}</strong> handles the subject matter. By downloading this PDF, you gain access to the complete content, including all original illustrations, footnotes, and appendices that are often missing in other digital versions. It is more than just a book; it is a resource that provides deep insights and valuable knowledge.`,
    `What sets this edition apart is the clarity of the text and the preservation of the original formatting. <strong>"${title}"</strong> is not just a collection of pages; it is a journey curated by <strong>${author}</strong>. Our user base has frequently requested this specific title, citing its importance in their respective fields of study and interest. We have listened to these requests and prioritized the upload of this specific file to our secure servers.`,
    `Delving into the pages of <strong>"${title}"</strong>, one can appreciate the meticulous effort put into its creation. The digital conversion process we utilize ensures that every word written by <strong>${author}</strong> is crisp and readable on any device. From the introduction to the final chapter, this document maintains the integrity of the original physical copy, providing you with an authentic reading experience from the comfort of your screen.`
  ];

  // --- BAGIAN 3: TECHNICAL SPECS & COMPATIBILITY (Paragraf Teknis - Filler) ---
  const part3 = [
    `Technically, this file is optimized for a wide range of devices. Whether you are using an iPad, an Android tablet, a Kindle, or a standard laptop, the PDF format of <strong>"${title}"</strong> ensures compatibility. The file size is approximately ${randomSize} MB, which is a testament to the high-resolution scanning process used. It contains roughly ${randomPages} pages of content. The text layer has been OCR-processed, making the document fully searchable—a critical feature for students and researchers.`,
    `Our technical team has verified the integrity of this file. The download package for <strong>"${title}"</strong> comes in a universal PDF format, ensuring that you do not need specialized software to open it. With a manageable size of ${randomSize} MB, it is easy to store on your cloud drive or local storage without taking up too much space. The document layout is responsive, meaning it will adjust beautifully whether you are reading in portrait or landscape mode.`,
    `We understand the importance of file quality. That is why this version of <strong>"${title}"</strong> has been checked for any missing pages or blurred text. With a page count of roughly ${randomPages}, it is the complete unabridged version. The metadata, including the ISBN ${isbn}, is embedded within the file for easy cataloging in your personal ebook management software like Calibre or Apple Books.`
  ];

  // --- BAGIAN 4: SECURITY & SAFETY (Paragraf Keamanan) ---
  const part4 = [
    `Security is our top priority. The file for <strong>"${title}"</strong> is hosted on our private, encrypted servers (Server #1 and Server #2). Before being made available for download, the file underwent a rigorous virus scanning process using industry-standard tools to ensure it is 100% clean of malware or adware. You can download with confidence, knowing that your device safety is guaranteed.`,
    `We take user safety seriously. The download link for <strong>"${title}"</strong> is protected by 256-bit SSL encryption. We have verified that the file is free from any malicious scripts. Our community of users creates a safe environment where knowledge can be shared without the risk of compromising your digital security. This "Verified Safe" status is updated daily to maintain trust.`,
    `Rest assured that your privacy and security are protected when accessing this content. The file <strong>"${title}"</strong> has been scanned by multiple antivirus engines and passed with flying colors. We do not bundle any unwanted software with our downloads. What you get is the pure, clean PDF file of the book by <strong>${author}</strong>, exactly as intended.`
  ];

  // --- BAGIAN 5: INSTRUCTIONS & CTA (Paragraf Penutup) ---
  const part5 = [
    `To access the full document, please click the download button above. You may be redirected to our partner gateway to verify your status as a real human user. This step is necessary to prevent bot abuse and keep our servers running smoothly for everyone. Once verified, the download for <strong>"${title}"</strong> will begin automatically. Thank you for using our library archive.`,
    `Getting your copy is simple. The "Download Full PDF" button is your gateway to this incredible work by <strong>${author}</strong>. Due to high traffic, we have implemented a brief verification step. This ensures that valuable resources like <strong>"${title}"</strong> remain available to genuine readers. Please follow the on-screen instructions to complete the process and unlock your file.`,
    `Don't miss the opportunity to add this book to your collection. Click the green button to initiate the secure download sequence for <strong>"${title}"</strong>. Registration is quick and free, granting you lifetime access not just to this file, but to our entire database of millions of books and documents. Join our community of readers today.`
  ];

  // RAKIT SEMUA BAGIAN
  return `
    <p>${getRandomItem(part1)}</p>
    <p>${getRandomItem(part2)}</p>
    <div class="spec-box">
        <h4>Document Properties</h4>
        <ul>
            <li><strong>File Name:</strong> ${title.replace(/\s+/g, '_')}_v2.4.pdf</li>
            <li><strong>Author:</strong> ${author}</li>
            <li><strong>Date Added:</strong> ${date}</li>
            <li><strong>File Size:</strong> ${randomSize} MB</li>
            <li><strong>Pages:</strong> ~${randomPages} pages</li>
            <li><strong>Language:</strong> English</li>
            <li><strong>Status:</strong> <span style="color:green; font-weight:bold;">Available</span></li>
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

// --- 4. FUNGSI EXTERNAL: OPENLIBRARY ---
async function getOpenLibraryData(isbn) {
  try {
    const cleanIsbn = isbn.replace(/[^0-9X]/gi, "");
    const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${cleanIsbn}&jscmd=data&format=json`;
    const response = await fetch(url, { headers: { "User-Agent": "CloudflareWorker/1.0" } });
    if (!response.ok) return null;
    const data = await response.json();
    const key = `ISBN:${cleanIsbn}`;
    const bookData = data[key];
    if (!bookData) return null;

    let authorName = "Unknown Author";
    if (bookData.authors && bookData.authors.length > 0) {
      authorName = bookData.authors[0].name;
    }
    const title = bookData.title || "Document Archive";

    // GENERATE DESKRIPSI PANJANG (500+ KATA)
    const longDescription = generateLongDescription(title, authorName, cleanIsbn);

    let coverUrl = null;
    if (bookData.cover) {
      coverUrl = bookData.cover.large || bookData.cover.medium || bookData.cover.small;
    }

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

// ====================================================================
// TEMPLATE UTAMA
// ====================================================================
function renderPage(post, SITE_URL) {
  const metaDescription = truncate(post.Deskripsi, 200);
  
  const placeholderImage = "https://via.placeholder.com/1200x630?text=Protected+File";
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
        <title>Download ${post.Judul} Full PDF - Secure Archive</title>
        <meta name="description" content="${metaDescription}" />
        <meta property="og:title" content="${post.Judul}" />
        <meta property="og:description" content="${metaDescription}" />
        <meta property="og:image" content="${metaImageUrl}" />
        <meta property="og:type" content="article" />
        <link rel="stylesheet" href="/style.css?v=1.1" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet" />
        <style>
          /* CSS FIX UNTUK POSISI TOMBOL DAN TEKS */
          .download-container {
             display: flex;
             flex-direction: column; /* INI KUNCINYA: Atur jadi kolom (atas-bawah) */
             align-items: center;    /* Tengah secara horizontal */
             justify-content: center;
             margin: 30px 0;
             width: 100%;
          }
          
          .download-btn {
             display: flex;
             align-items: center;
             justify-content: center;
             gap: 10px;
             background-color: #28a745;
             color: white;
             font-size: 18px;
             font-weight: 700;
             padding: 18px 40px;
             text-decoration: none;
             border-radius: 50px;
             box-shadow: 0 10px 20px rgba(40, 167, 69, 0.3);
             transition: transform 0.2s;
             width: 100%;
             max-width: 450px; /* Batasi lebar tombol */
             text-transform: uppercase;
          }
          
          .download-btn:hover { transform: scale(1.02); background-color: #218838; }
          .download-btn:active { transform: scale(0.98); }

          /* Style untuk teks status server */
          .server-status {
             margin-top: 15px; /* Jarak dari tombol */
             font-size: 0.9rem;
             color: #666;
             display: flex;
             gap: 10px;
             align-items: center;
          }
          
          .dot { height: 8px; width: 8px; background-color: #28a745; border-radius: 50%; display: inline-block; }

          .post-detail-image { 
            max-width: 100%; height: auto; max-height: 500px; 
            object-fit: contain; margin-bottom: 20px; 
            border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          }

          /* Style untuk Konten Generator */
          .generated-content { font-size: 1.05rem; line-height: 1.8; color: #333; text-align: left; }
          .generated-content p { margin-bottom: 20px; }
          .spec-box { background: #f1f8e9; border: 1px solid #c8e6c9; padding: 25px; border-radius: 10px; margin: 30px 0; }
          .spec-box h4 { margin-top: 0; margin-bottom: 15px; color: #2e7d32; }
          .spec-box ul { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          @media (max-width: 600px) { .spec-box ul { grid-template-columns: 1fr; } }
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
              <a href="#" class="download-btn" onclick="openMyLinks()">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                 DOWNLOAD FULL PDF
              </a>
              
              <div class="server-status">
                 <span class="dot"></span> Secure Server #1 &bull; Verified Safe &bull; Fast Speed
              </div>
            </div>

            <hr style="margin: 40px 0; border: 0; border-top: 1px solid #eee;">

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
        // 2. Fallback Jika Gagal Total (Data Dummy Penuh)
        const fakeTitle = "Private Archive Document";
        const fakeDesc = generateLongDescription(fakeTitle, "System Admin", uniqueCode);
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
