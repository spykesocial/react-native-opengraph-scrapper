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
export {
  find
};
//# sourceMappingURL=charset.js.map