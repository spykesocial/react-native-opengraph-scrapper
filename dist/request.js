import * as chardet from "chardet";
import { find as findCharset } from "./charset.js";
import { extractMetaTags } from "./extract.js";
function headersToObject(responseHeaders) {
  const headers = {};
  if (responseHeaders && typeof responseHeaders.forEach === "function") {
    responseHeaders.forEach((value, key) => {
      headers[key] = value;
    });
  }
  return headers;
}
function buildFetchOptions(options) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout);
  return {
    headers: options.headers || {},
    signal: controller.signal,
    clearTimeout: () => clearTimeout(timeoutId)
  };
}
function normalizeCharset(charset) {
  return charset === "utf8" ? "utf-8" : charset;
}
async function readBodyAndCharset(response, responseHeaders, peekSize) {
  if (typeof response.arrayBuffer === "function" && typeof TextDecoder !== "undefined") {
    const bytes = new Uint8Array(await response.arrayBuffer());
    const preview = new TextDecoder("latin1").decode(bytes.slice(0, peekSize));
    const detectedCharset = findCharset(responseHeaders, preview, peekSize) || chardet.detect(bytes) || "utf8";
    try {
      return {
        body: new TextDecoder(normalizeCharset(String(detectedCharset))).decode(bytes),
        charset: detectedCharset
      };
    } catch {
      return {
        body: new TextDecoder("utf-8").decode(bytes),
        charset: detectedCharset
      };
    }
  }
  const body = await response.text();
  return {
    body,
    charset: findCharset(responseHeaders, body, peekSize) || chardet.detect(body)
  };
}
const requestAndResultsFormatter = async (options) => {
  const requestUrl = options.url;
  const fetchOptions = buildFetchOptions(options);
  let response;
  try {
    response = await fetch(requestUrl, {
      headers: fetchOptions.headers,
      signal: fetchOptions.signal
    });
  } finally {
    fetchOptions.clearTimeout();
  }
  const responseHeaders = headersToObject(response.headers);
  const { body: formatBody, charset: detectedCharset } = await readBodyAndCharset(
    response,
    responseHeaders,
    options.peekSize
  );
  if (response && response.status && response.status.toString().substring(0, 1) === "4") {
    throw new Error(`Response code ${response.status}`);
  }
  if (response && response.status && response.status.toString().substring(0, 1) === "5") {
    throw new Error(`Response code ${response.status}`);
  }
  if (formatBody === void 0 || formatBody === "") {
    throw new Error("Page not found");
  }
  const ogObject = extractMetaTags(formatBody, options);
  if (!options.onlyGetOpenGraphInfo) {
    ogObject.charset = detectedCharset;
  }
  ogObject.requestUrl = options.url;
  ogObject.success = true;
  return { ogObject, response };
};
export {
  requestAndResultsFormatter
};
//# sourceMappingURL=request.js.map