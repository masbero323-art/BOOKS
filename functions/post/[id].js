// Path: functions/post/[id].js

// ==================================================================
// KONFIGURASI SPINTAX (TETAP SAMA)
// ==================================================================
const DESC_PARTS_A = [
  "{TITLE} {stands as|represents|functions as} a {compelling|remarkable|powerful} testament to the {power|art|craft} of {well-crafted|sophisticated|expert} storytelling, {offering|presenting|delivering} a narrative that is as {intellectually stimulating|profoundly engaging} as it is {emotionally resonant|deeply moving}. From the {very first|opening} chapter, the author {establishes|creates|constructs} a world that feels both {expansive|vast} and {intimately detailed|richly textured}, inviting readers to {lose themselves|immerse themselves} in a journey that {transcends|defies|goes beyond} the boundaries of its genre. The pacing is {masterfully|expertly} handled, ensuring that every {plot point|twist} carries {significant weight|real impact}.",
  "In the {landscape|realm|context} of contemporary literature, {TITLE} {emerges|stands out|shines} as a {sophisticated|refined|deep} exploration of its core themes, blending {intricate|complex} plot development with a {profound|significant} understanding of the human condition. The author’s voice is {distinct|unique|original} and confident, weaving a {tapestry|web|network} of events that are both {unpredictable|surprising} and {deeply satisfying|rewarding}. It is {rare|uncommon} to find a work that {balances|harmonizes} high-stakes tension with {quiet|serene}, reflective moments so {seamlessly|perfectly}.",
  "{TITLE} {offers|provides|delivers} an {immersive|captivating} escape into a {masterfully constructed|brilliantly designed} narrative, {characterized|defined} by its {atmospheric depth|vivid detail} and the {undeniable|absolute} authenticity of its world-building. Rather than {relying on|following} conventional tropes, the story {carves its own path|creates its own trail}, exploring {complex|intricate} dynamics through a lens of {clarity|precision} and {nuanced intention|deep purpose}. The prose is {elegant|graceful} yet accessible, serving as a {perfect vessel|ideal medium} for this story."
];
const DESC_PARTS_B = [
  "What {truly|really} {distinguishes|sets apart} this work is the {meticulous|careful|detailed} attention paid to character {progression|growth|evolution} and the {subtle|delicate} interplay between {internal conflict|personal struggle} and {external pressure|outside forces}. As the narrative of {TITLE} {progresses|unfolds|develops}, the layers of the story are {peeled back|revealed} to {reveal|showcase} a core that is both {surprising|unexpected} and {inevitable|logical}. The interactions are portrayed with a {refreshing|notable} degree of {realism|authenticity}.",
  "The {thematic richness|depth of themes} in {TITLE} provides a {sturdy|solid|firm} foundation for its narrative arcs, {encouraging|promoting} a level of {engagement|interaction} that goes beyond {simple consumption|casual reading}. Readers will find themselves {reflecting on|pondering} the choices made by the characters, finding {parallels|connections} in their own lives while being {transported|carried away} to a {different|unique} reality. The structural integrity of the book is {remarkable|outstanding|impressive}.",
  "Delving {deeper|further} into the pages of {TITLE}, one {discovers|uncovers|finds} a narrative {rhythm|flow|pace} that is both {comforting|familiar} and {challenging|provocative}, {pushing the boundaries|expanding the limits} of what readers {expect|anticipate} from this genre. The author has a {gift|knack|talent} for description, using {language|prose} to create {vivid|striking} imagery that brings the {setting|environment} and the {emotional landscape|mood} to life with {striking|exceptional} clarity."
];
const DESC_PARTS_C = [
  "Furthermore, the {technical execution|skillful delivery} of the prose in {TITLE} ensures that the {reading|listening} experience is {smooth|fluid} and uninterrupted, allowing the {themes|core messages} to take center stage. The {balance|equilibrium} between dialogue and {descriptive passages|narration} is handled with {professional grace|expert precision}, ensuring that the world feels {lived-in|authentic} and the conversations feel {organic|natural}. This level of {craftsmanship|artistry} is {indicative of|a sign of} a deep respect for the reader’s {intelligence|time}.",
  "Beyond the {primary|main} plot, {TITLE} {excels|surpasses expectations} in creating a sense of {time and place|atmosphere} that is almost {tangible|physical}. The {environmental storytelling|scenic detail} complements the character arcs {perfectly|ideally}, providing a backdrop that is {essential|vital} to the story’s impact. Whether through {quiet|soft} moments of introspection or {high-energy|intense} sequences, the author maintains a {consistent|steady} quality that {is rarely seen|sets a high bar}."
];
const DESC_PARTS_D = [
  "In conclusion, for those who {value|appreciate} depth and a story that {respects|honors} its characters, {TITLE} is an {essential|must-have} addition to your library. Whether you {choose|prefer} to {immse yourself|lose yourself} in the {professional narration|premium audio} of an **Audible Free Trial** or {explore|read} every page through **Kindle Unlimited**, the power of the narrative remains {undiminished|equally strong}. It is a work that {bridges the gap|connects} between casual enjoyment and {serious literary merit|true engagement} across all digital formats.",
  "Ultimately, the experience of {exploring|reading} {TITLE} is one of {discovery|enlightenment}. This title {invites|calls for} a deeper connection, making it the {perfect|ideal} candidate for your next **Audible Premium Plus** selection or **Kindle digital** download. For anyone looking to {access|unlock} a world that is both {challenging|demanding} and {rewarding|satisfying}, this book provides a {remarkable|prime} opportunity to {utilize|maximize} your **Amazon member benefits** for a truly {seamless|premium} experience.",
  "As the final {chapters|pages} of {TITLE} draw to a close, the reader is left with a {sense of fulfillment|lasting impression}. The resolution {satisfies|deliveries} on every level, especially when {experienced|accessed} through the {high-quality|convenient} ecosystem of **Audible's narrated library** or the {vast|expansive} reach of **Kindle's digital edition**. It stands as a {rare find|true gem} that justifies its place in any modern collection, {highly recommended|perfectly suited} for those seeking {quality|top-tier} storytelling today."
];

// ==================================================================
// HELPER FUNCTIONS
// ==================================================================
function stringToHash(s){let h=0;if(!s)return h;for(let i=0;i<s.length;i++){h=((h<<5)-h)+s.charCodeAt(i);h=h&h}return Math.abs(h)}
function spinText(text, seed) {
  return text.replace(/\{([^{}]+)\}/g, (match, content) => {
    if (content === "TITLE") return match;
    const choices = content.split("|");
    const index = stringToHash(seed + content) % choices.length;
    return choices[index];
  });
}
function getSpintaxDesc(t) {
  const judulAsli = t && t !== "Title Book" ? t : "This book";
  const h = stringToHash(judulAsli);
  let p1 = DESC_PARTS_A[h % DESC_PARTS_A.length];
  let p2 = DESC_PARTS_B[h % DESC_PARTS_B.length];
  let p3 = DESC_PARTS_C[h % DESC_PARTS_C.length];
  let p4 = DESC_PARTS_D[h % DESC_PARTS_D.length];
  p1 = spinText(p1, h + "a");
  p2 = spinText(p2, h + "b");
  p3 = spinText(p3, h + "c");
  p4 = spinText(p4, h + "d");
  const regexTitle = new RegExp("{TITLE}", "g");
  p1 = p1.replace(regexTitle, judulAsli);
  p2 = p2.replace(regexTitle, judulAsli);
  p3 = p3.replace(regexTitle, judulAsli);
  p4 = p4.replace(regexTitle, judulAsli);
  return `<p>${p1}</p><p>${p2}</p><p>${p3}</p><p>${p4}</p>`;
}

// ==================================================================
// LOGIKA SCRAPING & FALLBACK
// ==================================================================
async function getPostFromDB(db, id) {
  try { if (!db) return null; const cleanId = id.toUpperCase(); const stmt = db.prepare("SELECT Judul, Image, Author, Kategori, KodeUnik, judul_seo, deskripsi FROM Buku WHERE KodeUnik = ?").bind(cleanId); return await stmt.first(); } catch(e) { return null; }
}

/* OLD CODE COMMENTED
async function fetchGoogleBooks(isbn) {
    try {
        const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
        const r = await fetch(url);
        const json = await r.json();
        if (json.totalItems > 0 && json.items[0].volumeInfo) {
            const info = json.items[0].volumeInfo;
            let img = "";
            if (info.imageLinks) { img = (info.imageLinks.thumbnail || info.imageLinks.smallThumbnail).replace('http:', 'https:').replace('&edge=curl', ''); }
            return { found: true, title: info.title, author: info.authors ? info.authors[0] : "Unknown", image: img };
        }
    } catch (e) {}
    return { found: false };
}
*/

// NEW LAYERED LOGIC FROM AMAZON.JS
async function fetchGoogleBooks(isbn) {
    // 1. MAIN STRATEGY: GOOGLE BOOKS
    try {
        const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
        const r = await fetch(url);
        if (r.ok) {
            const json = await r.json();
            if (json.totalItems > 0 && json.items[0].volumeInfo) {
                const info = json.items[0].volumeInfo;
                let img = "";
                if (info.imageLinks) { img = (info.imageLinks.thumbnail || info.imageLinks.smallThumbnail).replace('http:', 'https:').replace('&edge=curl', ''); }
                return { found: true, title: info.title, author: info.authors ? info.authors[0] : "Unknown Author", image: img };
            }
        }
    } catch (e) {}

    // 2. FALLBACK 1: CROSSREF METADATA API
    try {
        const crossrefUrl = `https://api.crossref.org/works/ISBN:${isbn}`;
        const crResponse = await fetch(crossrefUrl, { headers: { "User-Agent": "CloudflareWorkerBookBot/1.0" } });
        if (crResponse.ok) {
            const crJson = await crResponse.json();
            if (crJson.message) {
                const msg = crJson.message;
                const title = msg.title && msg.title.length > 0 ? msg.title[0] : "";
                let author = "Unknown Author";
                if (msg.author && msg.author.length > 0) {
                    const firstAuthor = msg.author[0];
                    author = firstAuthor.given ? `${firstAuthor.given} ${firstAuthor.family}` : firstAuthor.family;
                }
                if (title) {
                    return { found: true, title: title, author: author, image: "" };
                }
            }
        }
    } catch (e) {}

    // 3. FALLBACK 2: SCRAPE ISBNDB (VIA ISBNSEARCH)
    try {
        const searchUrl = `https://isbnsearch.org/isbn/${isbn}`;
        const sResponse = await fetch(searchUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
        });
        if (sResponse.ok) {
            const html = await sResponse.text();
            const bookInfoMatch = html.match(/<div class="bookinfo"[^>]*>([\s\S]*?)<\/div>/i);
            if (bookInfoMatch && bookInfoMatch[1]) {
                const innerHtml = bookInfoMatch[1];
                const titleMatch = innerHtml.match(/<h1>([\s\S]*?)<\/h1>/i);
                const authorMatch = innerHtml.match(/<p><strong>Author:<\/strong>\s*([\s\S]*?)<\/p>/i);
                if (titleMatch && titleMatch[1]) {
                    return {
                        found: true,
                        title: titleMatch[1].trim(),
                        author: authorMatch && authorMatch[1] ? authorMatch[1].replace(/<[^>]*>?/gm, '').trim() : "Unknown Author",
                        image: ""
                    };
                }
            }
        }
    } catch (e) {}

    return { found: false };
}


async function getOpenLibraryMetadata(isbn) {
  try {
    const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`;
    const response = await fetch(url, { headers: { "User-Agent": "CloudflareWorker/1.0" } });
    if (!response.ok) return { found: false };
    const data = await response.json();
    const key = `ISBN:${isbn}`;
    const bookData = data[key];
    if (bookData) {
      let desc = null;
      if (bookData.excerpts && bookData.excerpts.length > 0) { desc = bookData.excerpts[0].text; }
      else if (bookData.notes) { desc = bookData.notes; }
      return { found: true, title: bookData.title || null, description: desc || null, author: bookData.authors ? bookData.authors[0].name : "Unknown Author" };
    }
  } catch (error) { }
  return { found: false };
}

async function scrapeAmazon(asin) {
    try {
        const url = `https://www.amazon.com/dp/${asin}`;
        const r = await fetch(url, { 
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html',
                'Accept-Language': 'en-US,en;q=0.9'
            } 
        });
        const html = await r.text();
        const titleMatch = html.match(/id="productTitle"[^>]*>\s*([\s\S]*?)\s*<\/span>/i);
        let author = "";
        const authorPatterns = [
            /class="a-link-normal"[^>]*href="\/[^"]*\/e\/[^"]*"[^>]*>([\s\S]*?)<\/a>/i,
            /class="author notFaded"[^>]*>.*?<a[^>]*>([\s\S]*?)<\/a>/i,
            /class="contributorNameID"[^>]*>\s*([\s\S]*?)\s*<\/a>/i,
            /by\s*<span class="author[^>]*>.*?<a[^>]*>([\s\S]*?)<\/a>/i,
            /<span class="a-declarative"[^>]*data-action="a-modal"[^>]*>\s*([\s\S]*?)\s*\(Author\)/i
        ];
        for (let pattern of authorPatterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                const cleanAuthor = match[1].replace(/<[^>]*>?/gm, '').trim();
                if (cleanAuthor && !cleanAuthor.includes("{")) { author = cleanAuthor; break; }
            }
        }
        if (titleMatch && titleMatch[1]) { return { found: true, title: titleMatch[1].trim(), author: author || "Unknown Author" }; }
    } catch (e) { }
    return { found: false };
}

async function scrapeGoogleSearch(query) {
    try {
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36' } });
        const html = await r.text();
        const h3Match = html.match(/<h3[^>]*>([^<]+)<\/h3>/);
        if (h3Match && h3Match[1]) {
            let title = h3Match[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
            return { found: true, title: title.replace(/ - Amazon\.com.*/i, '').replace(/ - Amazon.*/i, '').trim() };
        }
    } catch (e) { }
    return { found: false };
}

async function scrapeDirectGoodreads(id) {
    try { const url = `https://www.goodreads.com/book/show/${id}`; const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }); if (!r.ok) return { found: false }; const html = await r.text(); const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/); const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/); const authorMatch = html.match(/class="ContributorLink__name"[^>]*data-testid="name">([^<]+)<\/span>/i); if (titleMatch && titleMatch[1]) { return { found: true, title: titleMatch[1], image: imageMatch ? imageMatch[1] : "", author: authorMatch ? authorMatch[1].trim() : "Unknown Author" }; } } catch (e) { } return { found: false };
}

async function getRedirectData(id) {
  try { const targetUrl = `https://www.goodreads.com/book_link/follow/3?book_id=${id}&source=compareprices`; const r = await fetch(targetUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, redirect: 'follow' }); const bnMatch = r.url.match(/ean=(\d{13})/) || r.url.match(/\/(\d{13})/); if (bnMatch && bnMatch[1]) return { found: true, id: bnMatch[1] }; } catch(e) {} return { found: false };
}

async function getDataFallback(id) {
  const cleanId = id.toUpperCase();
  let d = { Judul: "Restricted Document", Image: "", Author: "Unknown Author", Kategori: "General", KodeUnik: cleanId, judul_seo: "", deskripsi: "" };
  try {
    // LOGIKA KODE A (ASIN atau ISBN-10)
    if (cleanId.startsWith("A-") || /^B[A-Z0-9]{9}$/.test(cleanId)) { 
        const realId = cleanId.startsWith("A-") ? cleanId.substring(2) : cleanId; 
        d.Image = `https://images-na.ssl-images-amazon.com/images/P/${realId}.01.LZZZZZZZ.jpg`; 
        
        if (/^\d{9}[\d|X]$/.test(realId)) { // Jika ISBN-10
            const gb = await fetchGoogleBooks(realId);
            if (gb.found) { d.Judul = gb.title; d.Author = gb.author; if(gb.image) d.Image = gb.image; }
            else { const ol = await getOpenLibraryMetadata(realId); if (ol.found) { d.Judul = ol.title; d.Author = ol.author; d.deskripsi = ol.description; } }
        } else { // Jika ASIN Murni (B07...)
            const amz = await scrapeAmazon(realId);
            if (amz.found) { 
                d.Judul = amz.title; d.Author = amz.author; 
            } else { 
                // SARAN TERBAIK: Gunakan Google Search sebagai fallback ASIN
                const gSearch = await scrapeGoogleSearch(`amazon.com dp ${realId}`);
                if (gSearch.found) { d.Judul = gSearch.title; }
            }
        }
        return d; 
    }
    // LOGIKA KODE B (ISBN Murni)
    if (cleanId.startsWith("B-") || /^\d{9}[\d|X]$|^\d{13}$/.test(cleanId.replace(/-/g,""))) { 
        const realId = cleanId.startsWith("B-") ? cleanId.substring(2) : cleanId; 
        const cleanIsbn = realId.replace(/-/g,""); 
        d.Image = `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg`; 
        const gb = await fetchGoogleBooks(cleanIsbn); 
        if (gb.found) { d.Judul = gb.title; d.Author = gb.author; if (gb.image) d.Image = gb.image; } 
        else { const ol = await getOpenLibraryMetadata(cleanIsbn); if (ol.found) { d.Judul = ol.title; d.Author = ol.author; d.deskripsi = ol.description; } }
        return d; 
    }
    // LOGIKA KODE C (Goodreads ID)
    if (cleanId.startsWith("C-") || /^\d{1,9}$/.test(cleanId)) { 
        const realId = cleanId.startsWith("C-") ? cleanId.substring(2) : cleanId; 
        const gr = await scrapeDirectGoodreads(realId); 
        if (gr.found) { d.Judul = gr.title; d.Image = gr.image; d.Author = gr.author; return d; } 
        const redir = await getRedirectData(realId); 
        if (redir.found) { 
            const gb = await fetchGoogleBooks(redir.id); 
            if (gb.found) { d.Judul = gb.title; d.Author = gb.author; d.Image = gb.image; }
            else { const ol = await getOpenLibraryMetadata(redir.id); if (ol.found) { d.Judul = ol.title; d.Author = ol.author; d.deskripsi = ol.description; } }
        } 
        return d; 
    }
  } catch (e) { } return d;
}

// ==================================================================
// RENDERER & CPA LOGIC
// ==================================================================
function renderBookPage(post, ACTUAL_HOSTNAME, countryCode) {
  const pageTitle = post.judul_seo && post.judul_seo.trim() !== "" ? post.judul_seo : post.Judul;
  const finalDescription = post.deskripsi && post.deskripsi.trim() !== "" 
    ? `<p>${post.deskripsi.replace(/\n/g, '</p><p>')}</p>` 
    : getSpintaxDesc(post.Judul);
  const coverImage = post.Image || "https://via.placeholder.com/300x450?text=No+Cover";
  const domainName = ACTUAL_HOSTNAME.replace('https://', '').replace('http://', '').split('/')[0].toUpperCase();
  const rawHostname = ACTUAL_HOSTNAME.replace('https://', '').replace('http://', '').split('/')[0].toLowerCase();

  const LINK_A = "https://lowest-prices.eu/a/1wOzMiq8P3fXl8Q"; 
  const LINK_B = "https://lowest-prices.eu/a/R6mrXf5NLMFOA8w"; 
  const LINK_C = "https://lowest-prices.eu/a/YEwBZt62gEFVLoN"; 
  const LINK_D = "https://lowest-prices.eu/a/KrNkGUqYlhAzgD";  

  const ADSTERRA_TOP_BANNER = `<div style="text-align:center; margin:10px 0; overflow:hidden;"><script type="text/javascript">atOptions = {'key' : '6c75db738aadb52bd488e133d7bffd1f','format' : 'iframe','height' : 90,'width' : 728,'params' : {}};</script><script type="text/javascript" src="https://interventioncopiedloitering.com/6c75db738aadb52bd488e133d7bffd1f/invoke.js"></script></div>`;

  let buttonHtml = "";
  let mobileStickyHtml = "";

  const audibleLink = ["AT", "CH"].includes(countryCode) ? LINK_B : LINK_A;
  buttonHtml += `<a href="${audibleLink}" class="btn btn-audible" target="_blank" rel="nofollow sponsored">Start Audible Audiobooks Trial</a><p class="disclosure-text">Start your 30-day free trial. Cancel anytime.</p>`;
  mobileStickyHtml += `<a href="${audibleLink}" class="btn-sm btn-audible" target="_blank" rel="nofollow sponsored">Audible Free Trial</a>`;

  buttonHtml += `<a href="${LINK_C}" class="btn btn-kindle" style="background: #192f2d; margin-top: 12px;" target="_blank" rel="nofollow sponsored">Summarize Book with Blinkist</a><p class="disclosure-text">Get the key insights in 15 minutes.</p>`;
  mobileStickyHtml += `<a href="${LINK_C}" class="btn-sm btn-kindle" style="background: #192f2d;" target="_blank" rel="nofollow sponsored">Blinkist Summary</a>`;

  buttonHtml += `<a href="${LINK_D}" class="btn btn-edition" style="background: #232f3e; color: #fff; margin-top: 12px;" target="_blank" rel="nofollow sponsored">Find Rare Editions on AbeBooks</a>`;
  mobileStickyHtml += `<a href="${LINK_D}" class="btn-sm btn-edition" style="background: #232f3e; color: #fff;" target="_blank" rel="nofollow sponsored">Shop AbeBooks</a>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>${pageTitle}</title>
    <style>
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; background-color: #f8fafc; color: #1e293b; padding-bottom: 80px; }
        .navbar { height: 64px; background: white; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; position: fixed; top: 0; width: 100%; z-index: 100; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .nav-title { font-weight: 700; color: #2563eb; font-size: 20px; }
        .main-container { display: flex; max-width: 1100px; margin: 96px auto 40px auto; padding: 0 24px; gap: 40px; }
        .sidebar { width: 320px; flex-shrink: 0; }
        .book-card { background: white; padding: 24px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; position: sticky; top: 96px; }
        .pdf-cover-img { width: 100%; border-radius: 12px; margin-bottom: 20px; }
        .btn-group { margin-top: 20px; display: flex; flex-direction: column; gap: 4px; }
        .btn { display: inline-flex; align-items: center; justify-content: center; width: 100%; padding: 16px; font-weight: 700; border: none; border-radius: 12px; cursor: pointer; text-decoration: none; font-size: 14px; transition: 0.2s; text-align: center; }
        .btn-audible { background: #f59e0b; color: #000; }
        .btn-kindle { background: #0ea5e9; color: #fff; }
        .disclosure-text { font-size: 11px; color: #64748b; margin-top: 4px; margin-bottom: 12px; text-align: center; }
        .mobile-sticky-bar { display: none; position: fixed; bottom: 0; left: 0; width: 100%; background: white; padding: 12px 20px; box-shadow: 0 -4px 10px rgba(0,0,0,0.1); z-index: 200; gap: 10px; }
        .btn-sm { flex: 1; padding: 12px; font-size: 11px; border-radius: 8px; text-align: center; font-weight: 700; text-decoration: none; }
        .legal-footer { text-align: center; padding: 40px 20px; font-size: 13px; color: #94a3b8; border-top: 1px solid #e2e8f0; margin-top: 40px; }
        .legal-links a { color: #64748b; text-decoration: none; margin: 0 12px; cursor: pointer; font-weight: 600; }
        .legal-modal-overlay { display: none; position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center; }
        .legal-modal-box { background: white; padding: 40px; border-radius: 16px; max-width: 600px; width: 90%; position: relative; max-height: 80vh; overflow-y: auto; }
        @media (max-width: 768px) { .main-container { flex-direction: column; margin-top: 80px; } .sidebar { width: 100%; } .book-card { position: static; } .mobile-sticky-bar { display: flex; } body { padding-bottom: 110px; } }
    </style>
</head>
<body>
    <nav class="navbar"><div class="nav-title"><a href="/" style="text-decoration:none; color:#2563eb;">${domainName}</a></div></nav>
    <div class="main-container">
        <aside class="sidebar"><div class="book-card"><img src="${coverImage}" class="pdf-cover-img" alt="${post.Judul}"><h1 style="font-size: 20px; margin: 0 0 8px 0;">${post.Judul}</h1><p>Author: ${post.Author}</p><div class="btn-group">${buttonHtml}</div></div></aside>
        <main class="content-area">
            ${ADSTERRA_TOP_BANNER}
            <div class="book-content" style="margin-top:20px;"><h2>Description & Summary</h2><div style="line-height: 1.8;">${finalDescription}</div></div>
            <footer class="legal-footer"><div class="legal-links"><a onclick="openLegal('about')">About Us</a> | <a onclick="openLegal('disclaimer')">Disclaimer</a> | <a onclick="openLegal('contact')">Contact</a> | <a onclick="openLegal('tos')">Terms of Service</a></div><p>Copyright © 2026 ${domainName}. All rights reserved.</p></footer>
        </main>
    </div>
    <div id="legalModal" class="legal-modal-overlay"><div class="legal-modal-box"><span style="position:absolute; top:20px; right:20px; cursor:pointer; font-size:24px; color: #94a3b8;" onclick="closeLegal()">&times;</span><div id="legalContent"></div></div></div>
    <div class="mobile-sticky-bar">${mobileStickyHtml}</div>
    <script>
      function openLegal(t) {
        var m=document.getElementById('legalModal'), c=document.getElementById('legalContent'), d="${rawHostname}";
        if(t==='about') c.innerHTML='<h2>About</h2><p>Welcome to <strong>'+d+'</strong>.</p>';
        if(t==='disclaimer') c.innerHTML='<h2>Disclaimer</h2><p><strong>'+d+'</strong> is an affiliate site.</p>';
        if(t==='contact') c.innerHTML='<h2>Contact</h2><p>Email: support@'+d+'</p>';
        if(t==='tos') c.innerHTML='<h2>Terms</h2><p>Terms of service for '+d+'.</p>';
        m.style.display='flex';
      }
      function closeLegal() { document.getElementById('legalModal').style.display='none'; }
    </script>
</body></html>`;
}

export async function onRequestGet(context) {
  const { env, params, request } = context; 
  const db = env.DB;
  const url = new URL(request.url);
  /* const countryCode = (request.cf ? request.cf.country : "US") || "US"; */
  const countryCode = (request.cf ? request.cf.country : "GB") || "GB";
  const ACTUAL_HOSTNAME = request.headers.get("X-Forwarded-Host") || request.headers.get("host") || url.hostname;
  const cacheKey = new Request(url.toString() + "?geo=" + countryCode, request);
  const cache = caches.default;
  let response = await cache.match(cacheKey);
  if (response) return response;

  try {
    let post = await getPostFromDB(db, params.id);
    if (!post) post = await getDataFallback(params.id);
    const html = renderBookPage(post, ACTUAL_HOSTNAME, countryCode);
    response = new Response(html, { headers: { "Content-Type": "text/html;charset=UTF-8", "Cache-Control": "public, max-age=31536000" } });
    context.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (e) { return new Response("Error: " + e.message, { status: 500 }); }
}
