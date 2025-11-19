// ============================================================
// 1. HELPER FUNCTIONS
// ============================================================
function cyrb128(str) {
    let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    return [(h1^h2^h3^h4)>>>0, (h2^h3)>>>0, (h3^h4)>>>0, (h4^h1)>>>0];
}

function sfc32(a, b, c, d) {
    return function() {
        a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
        var t = (a + b) | 0; 
        a = b ^ b >>> 9; b = c + (c << 3) | 0; 
        c = (c << 21 | c >>> 11); d = d + 1 | 0; 
        t = t + d | 0; c = c + t | 0; 
        return (t >>> 0) / 4294967296;
    }
}

function escapeXML(str) {
  if (!str) return "";
  return str.replace(/[<>&"']/g, m => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;','\'':'&#39;'}[m]));
}

function cleanText(str) {
    if (!str) return "";
    return str.replace(/[-_]/g, " ").toUpperCase();
}

export async function onRequest(context) {
  const { request, params } = context;
  const url = new URL(request.url);
  const SITE_URL = url.origin;

  const LINK_OFFER = "https://adclub.g2afse.com/click?pid=1860&offer_id=21";
  const LINK_ADSTERRA = "https://www.effectivegatecpm.com/xr7j10z1r?key=73a9402da2964f3c92209293558508e5";

  // ============================================================
  // BAGIAN 1: GENERATE RSS XML (SINGLE PAGE ROTATING)
  // ============================================================
  // Mendeteksi akhiran .xml (bisa rss.xml, feed.xml, data.xml)
  if (url.pathname.endsWith(".xml")) {

    // 1. Bersihkan Path
    let pathSegments = [];
    if (Array.isArray(params.path)) {
        pathSegments = [...params.path];
        // Hapus elemen terakhir (nama file xml)
        if (pathSegments.length > 0) pathSegments.pop();
    } else {
        const parts = url.pathname.split('/').filter(p => p.length > 0);
        if (parts.length > 0) parts.pop();
        pathSegments = parts;
    }

    let topicString = pathSegments.map(s => cleanText(s)).join(" ");
    if (!topicString) topicString = "ALL FILES";

    // 2. CREATE SEED (URL + TANGGAL HARI INI)
    // Kita HAPUS seed page. Hanya bergantung pada Tanggal.
    const todayDate = new Date().toISOString().slice(0, 10); 
    
    // Seed unik berdasarkan folder path & tanggal
    // Besok tanggal beda -> Seed beda -> Data beda.
    const seedString = `${pathSegments.join("/")}-${todayDate}`;
    
    const seed = cyrb128(seedString);
    const rand = sfc32(seed[0], seed[1], seed[2], seed[3]);

    const feedTitle = `DAILY FEED: ${escapeXML(topicString)} - ${todayDate}`;

    // 3. JUMLAH POST: 150 - 200 (Acak Harian)
    const minPost = 150;
    const maxPost = 200;
    const jumlahItemGenerate = Math.floor(rand() * (maxPost - minPost + 1)) + minPost;

    let itemsXML = "";
    const now = new Date();
    
    // Distribusi waktu: Mundur setiap ~7 menit
    const minutesGap = 7; 

    for (let i = 0; i < jumlahItemGenerate; i++) {
        const randomVol = Math.floor(rand() * 90000) + 1000; 
        const judulItem = `${topicString} Volume ${randomVol}`;
        
        // ID Unik Stabil Harian
        const uniqueID = `B-${seed[0]}-${i}`; 
        const postUrl = `${SITE_URL}/post/${uniqueID}`;

        const itemTimeOffset = (i * minutesGap * 60 * 1000);
        const itemDate = new Date(now.getTime() - itemTimeOffset);
        const reviewCount = Math.floor(rand() * 500);

        itemsXML += `
    <item>
      <title>${escapeXML(judulItem)}</title> 
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <g:id>${uniqueID}</g:id>
      <description><![CDATA[
        Date: ${todayDate}<br/>
        Category: ${escapeXML(topicString)}<br/>
        Reviews: ${reviewCount}<br/>
        Status: <span style="color:green">Available</span><br/>
        <br/>
        New upload: ${escapeXML(judulItem)}.<br/>
        <a href="${LINK_OFFER}"><b>[CLICK HERE TO DOWNLOAD]</b></a>
      ]]></description>
      <g:image_link>https://via.placeholder.com/600x800?text=${encodeURIComponent(topicString + " " + randomVol)}</g:image_link>
      <g:availability>in stock</g:availability>
      <pubDate>${itemDate.toUTCString()}</pubDate>
    </item>`;
    }

    // TIDAK ADA LINK NEXT PAGE

    const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXML(feedTitle)}</title>
  <link>${SITE_URL}</link>
  <description>Daily Updates for ${escapeXML(topicString)}</description>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${url.href}" rel="self" type="application/rss+xml" />
  ${itemsXML}
</channel>
</rss>`;

    return new Response(xml, {
      headers: { 
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "s-maxage=3600"
      },
    });
  }

  // ============================================================
  // BAGIAN 2: HTML FALLBACK (FAKE PDF)
  // ============================================================
  const pathSegmentsHTML = url.pathname.split('/').filter(p => p.length > 0);
  let rawSlug = pathSegmentsHTML[pathSegmentsHTML.length - 1] || "Document";
  let displayTitle = cleanText(rawSlug.replace(/\.(html|php)$/, ""));
  if (pathSegmentsHTML.length === 0) displayTitle = "SECURE REPOSITORY";

  const htmlContent = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Download ${displayTitle}</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&display=swap" rel="stylesheet" />
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: "Poppins", sans-serif; background-color: #525659; overflow: hidden; height: 100vh; position: relative; }
          .pdf-viewer-container { filter: blur(6px); opacity: 0.8; pointer-events: none; height: 100%; display: flex; flex-direction: column; align-items: center; }
          .pdf-header { width: 100%; height: 50px; background-color: #323639; display: flex; align-items: center; padding: 0 20px; }
          .fake-title { color: #ddd; font-size: 14px; margin-left: 15px; }
          .pdf-page { background: white; width: 800px; max-width: 90%; height: 120vh; margin-top: 20px; padding: 50px; }
          .overlay-container { position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 10; background: rgba(0, 0, 0, 0.6); }
          .card-box { background: white; padding: 40px; border-radius: 15px; text-align: center; width: 450px; border-top: 5px solid #28a745; }
          .signup-btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; background-color: #28a745; color: white; font-size: 18px; font-weight: 700; padding: 18px 30px; text-decoration: none; border-radius: 50px; width: 100%; }
        </style>
      </head>
      <body>
        <div class="pdf-viewer-container">
          <div class="pdf-header"><div class="fake-title">${displayTitle}.pdf</div></div>
          <div class="pdf-page"></div>
        </div>
        <div class="overlay-container">
          <div class="card-box">
            <h2>Registration Required</h2>
            <p>File: <strong>${displayTitle}.pdf</strong></p>
            <a href="#" class="signup-btn" onclick="openMyLinks()">SIGN UP & DOWNLOAD</a>
          </div>
        </div>
        <script>
          function openMyLinks() {
            window.open('${LINK_OFFER}', '_blank');
            window.location.href = '${LINK_ADSTERRA}';
          }
        </script>
      </body>
    </html>`;

  return new Response(htmlContent, {
    headers: { "Content-Type": "text/html;charset=UTF-8" }
  });
}
