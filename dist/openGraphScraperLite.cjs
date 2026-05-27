"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var openGraphScraperLite_exports = {};
__export(openGraphScraperLite_exports, {
  default: () => openGraphScraperLite_default
});
module.exports = __toCommonJS(openGraphScraperLite_exports);
var import_extract = require("./extract.js");
var import_request = require("./request.js");
var import_utils = require("./utils.js");
const defaultUrlValidatorSettings = {
  protocols: ["http", "https"],
  require_tld: true,
  require_protocol: false,
  require_host: true,
  require_valid_protocol: true,
  allow_underscores: false,
  host_whitelist: false,
  host_blacklist: false,
  allow_trailing_dot: false,
  allow_protocol_relative_urls: false,
  disallow_auth: false
};
function normalizeScraperError(exception) {
  if (exception && typeof exception === "object" && "code" in exception && ["ENOTFOUND", "EHOSTUNREACH", "ENETUNREACH"].includes(String(exception.code))) {
    throw new Error("Page not found");
  }
  if (exception && typeof exception === "object" && "code" in exception && ["ERR_INVALID_URL", "EINVAL"].includes(String(exception.code))) {
    throw new Error("Page not found");
  }
  if (exception instanceof Error && exception.message === "fetch failed") {
    throw new Error("Page not found");
  }
  if (exception && typeof exception === "object" && "code" in exception && exception.code === "ETIMEDOUT") {
    throw new Error("Time out");
  }
  if (exception instanceof Error && exception.message === "Request timed out") {
    throw new Error("Time out");
  }
  if (exception && typeof exception === "object" && "name" in exception && exception.name === "AbortError") {
    throw new Error("Time out");
  }
  if (exception instanceof Error && exception.message.startsWith("Response code 4")) {
    throw new Error("Page not found");
  }
  if (exception instanceof Error && exception.message === "Forbidden") {
    throw new Error("Page not found");
  }
  if (exception instanceof Error && exception.message.startsWith("Response code 5")) {
    throw new Error("Web server is returning error");
  }
  if (exception instanceof Error && exception.message === "Internal Server Error") {
    throw new Error("Web server is returning error");
  }
  if (exception instanceof Error) throw exception;
  throw new Error("Page not found");
}
const setOptionsAndReturnOpenGraphResults = async (options) => {
  options.customMetaTags = options.customMetaTags || [];
  if (options.html) {
    if (options.url) throw new Error("Must specify either `url` or `html`, not both");
    const ogObject = (0, import_extract.extractMetaTags)(options.html, options);
    if (!options.onlyGetOpenGraphInfo) {
      ogObject.charset = "utf8";
    }
    ogObject.requestUrl = null;
    ogObject.success = true;
    return {
      ogObject,
      response: {
        body: options.html,
        ok: true,
        status: 200,
        text: async () => options.html || ""
      }
    };
  }
  if (!options.urlValidatorSettings) {
    options.urlValidatorSettings = defaultUrlValidatorSettings;
  }
  const validated = (0, import_utils.validate)(options.url, options.timeout, options.urlValidatorSettings);
  if (!validated.url) throw new Error("Invalid URL");
  options.url = validated.url;
  options.timeout = validated.timeout;
  const requestOptions = {
    peekSize: 1024,
    retry: 2,
    onlyGetOpenGraphInfo: false,
    ogImageFallback: true,
    allMedia: false,
    headers: {},
    ...options,
    url: options.url,
    timeout: options.timeout
  };
  if ((0, import_utils.isThisANonHTMLUrl)(requestOptions.url)) throw new Error("Must scrape an HTML page");
  if (requestOptions.blacklist && requestOptions.blacklist.some((blacklistedHostname) => requestOptions.url.includes(blacklistedHostname))) {
    throw new Error("Host name has been black listed");
  }
  try {
    return await (0, import_request.requestAndResultsFormatter)(requestOptions);
  } catch (exception) {
    normalizeScraperError(exception);
  }
};
var openGraphScraperLite_default = setOptionsAndReturnOpenGraphResults;
//# sourceMappingURL=openGraphScraperLite.cjs.map