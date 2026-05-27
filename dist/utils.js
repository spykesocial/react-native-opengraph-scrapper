import validator from "validator";
const isUrlValid = (url, urlValidatorSettings) => typeof url === "string" && url.length > 0 && validator.isURL(url, urlValidatorSettings);
const coerceUrl = (url) => /^(f|ht)tps?:\/\//i.test(url) ? url : `http://${url}`;
const isTimeoutValid = (timeout) => typeof timeout === "number" && /^\d{1,10}$/.test(String(timeout));
const validate = (url, timeout, urlValidatorSettings) => ({
  url: isUrlValid(url, urlValidatorSettings) ? coerceUrl(url) : null,
  timeout: isTimeoutValid(timeout) ? timeout : 2e3
});
const findImageTypeFromUrl = (url) => {
  let type = url.split(".").pop() || "";
  [type] = type.split("?");
  return type;
};
const isImageTypeValid = (type) => {
  const validImageTypes = [
    "apng",
    "bmp",
    "gif",
    "ico",
    "cur",
    "jpg",
    "jpeg",
    "jfif",
    "pjpeg",
    "pjp",
    "png",
    "svg",
    "tif",
    "tiff",
    "webp"
  ];
  return validImageTypes.includes(type);
};
const isThisANonHTMLUrl = (url) => {
  const invalidImageTypes = [
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
    ".3gp",
    ".avi",
    ".mov",
    ".mp4",
    ".m4v",
    ".m4a",
    ".mp3",
    ".mkv",
    ".ogv",
    ".ogm",
    ".ogg",
    ".oga",
    ".webm",
    ".wav",
    ".bmp",
    ".gif",
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".zip",
    ".rar",
    ".tar",
    ".tar.gz",
    ".tgz",
    ".tar.bz2",
    ".tbz2",
    ".txt",
    ".pdf"
  ];
  const extension = findImageTypeFromUrl(url);
  return invalidImageTypes.some((type) => `.${extension}`.includes(type));
};
const removeNestedUndefinedValues = (object) => {
  Object.entries(object).forEach(([key, value]) => {
    if (value && typeof value === "object") removeNestedUndefinedValues(value);
    else if (value === void 0) delete object[key];
  });
  return object;
};
export {
  findImageTypeFromUrl,
  isImageTypeValid,
  isThisANonHTMLUrl,
  isUrlValid,
  removeNestedUndefinedValues,
  validate
};
//# sourceMappingURL=utils.js.map