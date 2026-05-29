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
var charset_exports = {};
__export(charset_exports, {
  find: () => find
});
module.exports = __toCommonJS(charset_exports);
const CHARTSET_RE = /(?:charset|encoding)\s{0,10}=\s{0,10}['"]? {0,10}([\w-]{1,100})/i;
function find(obj, data, peekSize) {
  let matches = null;
  let end = 0;
  if (data) {
    peekSize = peekSize || 512;
    end = data.length > peekSize ? peekSize : data.length;
  }
  let contentType = obj;
  if (contentType && typeof contentType === "object") {
    let headers = obj;
    if ("headers" in contentType && contentType.headers) {
      headers = contentType.headers;
    }
    contentType = headers["content-type"] || headers["Content-Type"];
  }
  if (typeof contentType === "string") {
    matches = CHARTSET_RE.exec(contentType);
  }
  if (!matches && end > 0 && data) {
    matches = CHARTSET_RE.exec(data.slice(0, end));
  }
  if (!matches) return null;
  const charset = matches[1].toLowerCase();
  return charset === "utf-8" ? "utf8" : charset;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  find
});
//# sourceMappingURL=charset.cjs.map