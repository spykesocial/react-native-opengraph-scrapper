#!/usr/bin/env node
// Web search from inside the repo — no API keys required.
// Usage: node research.mjs "<query>"

const query = process.argv.slice(2).join(" ").trim();
if (!query) {
  console.error('usage: research.sh "<query>"');
  process.exit(2);
}

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function unwrapRedirect(href) {
  try {
    const uddg = href.match(/[?&]uddg=([^&]+)/);
    if (uddg) return decodeURIComponent(uddg[1]);
    if (/^https?:\/\//i.test(href)) return href;
    if (href.startsWith("//")) return "https:" + href;
  } catch {
    // fall through
  }
  return null;
}

async function searchDdg() {
  const url = "https://lite.duckduckgo.com/lite/?q=" + encodeURIComponent(query);
  const res = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
      accept: "text/html",
      "accept-language": "en-US,en;q=0.9",
    },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error("HTTP " + res.status);
  const html = await res.text();

  const snippets = [];
  const snippetRe = /class=['"]result-snippet['"][^>]*>([\s\S]*?)<\/td>/gi;
  let m;
  while ((m = snippetRe.exec(html)) !== null) snippets.push(decodeEntities(m[1]));

  const results = [];
  const linkRe = /<a[^>]*rel=['"]nofollow['"][^>]*href=['"]([^'"]+)['"][^>]*>([\s\S]*?)<\/a>/gi;
  while ((m = linkRe.exec(html)) !== null && results.length < 8) {
    const resultUrl = unwrapRedirect(m[1]);
    const title = decodeEntities(m[2]);
    if (!resultUrl || !title || /duckduckgo\.com/i.test(resultUrl)) continue;
    results.push({ title, url: resultUrl, snippet: snippets[results.length] || "" });
  }
  return results;
}

try {
  const results = await searchDdg();
  if (results.length === 0) {
    console.log("No results found for: " + query);
    console.log("Try a more specific error string, or use fetch.sh on a known docs/npm/GitHub URL.");
    process.exit(0);
  }
  console.log("Results for: " + query + "\n");
  results.forEach((r, i) => {
    console.log(i + 1 + ". " + r.title);
    console.log("   " + r.url);
    if (r.snippet) console.log("   " + r.snippet);
    console.log("");
  });
} catch (err) {
  console.error("research failed: " + (err && err.message ? err.message : String(err)));
  console.error("The internet may be unreachable from this environment. Continue with local reasoning,");
  console.error("or use fetch.sh on a known documentation URL (npm, GitHub, changelogs).");
  process.exit(1);
}
