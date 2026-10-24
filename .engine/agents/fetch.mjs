#!/usr/bin/env node
// Fetch a URL and print readable text.
// Usage: node fetch.mjs <url> [maxChars]

const url = (process.argv[2] || "").trim();
const maxChars = Number(process.argv[3] || 8000);
if (!url || !/^https?:\/\//i.test(url)) {
  console.error("usage: fetch.sh <url> [maxChars]");
  process.exit(2);
}

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

try {
  const res = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
      accept: "text/html,application/xhtml+xml,text/plain",
      "accept-language": "en-US,en;q=0.9",
    },
    signal: AbortSignal.timeout(20000),
    redirect: "follow",
  });
  if (!res.ok) throw new Error("HTTP " + res.status);
  let body = await res.text();
  body = body
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--([\s\S]*?)-->/g, " ")
    .replace(/<[^>]+>/g, "\n");
  const text = decodeEntities(body)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
  console.log("URL: " + url);
  console.log("-----");
  console.log(text.slice(0, maxChars));
  if (text.length > maxChars) console.log("\n... [truncated at " + maxChars + " chars]");
} catch (err) {
  console.error("fetch failed: " + (err && err.message ? err.message : String(err)));
  process.exit(1);
}
