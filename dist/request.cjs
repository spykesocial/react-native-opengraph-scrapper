var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var request_exports = {};
__export(request_exports, {
  requestAndResultsFormatter: () => requestAndResultsFormatter
});
module.exports = __toCommonJS(request_exports);
var chardet = __toESM(require("chardet"), 1);
var import_charset = require("./charset.js");
var import_extract = require("./extract.js");
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
    const detectedCharset = (0, import_charset.find)(responseHeaders, preview, peekSize) || chardet.detect(bytes) || "utf8";
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
    charset: (0, import_charset.find)(responseHeaders, body, peekSize) || chardet.detect(body)
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
  const ogObject = (0, import_extract.extractMetaTags)(formatBody, options);
  if (!options.onlyGetOpenGraphInfo) {
    ogObject.charset = detectedCharset;
  }
  ogObject.requestUrl = options.url;
  ogObject.success = true;
  return { ogObject, response };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  requestAndResultsFormatter
});
//# sourceMappingURL=request.cjs.map