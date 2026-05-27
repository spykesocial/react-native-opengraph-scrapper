"use strict";
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
var utils_exports = {};
__export(utils_exports, {
  findImageTypeFromUrl: () => findImageTypeFromUrl,
  isImageTypeValid: () => isImageTypeValid,
  isThisANonHTMLUrl: () => isThisANonHTMLUrl,
  isUrlValid: () => isUrlValid,
  removeNestedUndefinedValues: () => removeNestedUndefinedValues,
  validate: () => validate
});
module.exports = __toCommonJS(utils_exports);
var import_validator = __toESM(require("validator"), 1);
const isUrlValid = (url, urlValidatorSettings) => typeof url === "string" && url.length > 0 && import_validator.default.isURL(url, urlValidatorSettings);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  findImageTypeFromUrl,
  isImageTypeValid,
  isThisANonHTMLUrl,
  isUrlValid,
  removeNestedUndefinedValues,
  validate
});
//# sourceMappingURL=utils.cjs.map