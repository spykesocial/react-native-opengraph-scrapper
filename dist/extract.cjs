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
var extract_exports = {};
__export(extract_exports, {
  extractMetaTags: () => extractMetaTags
});
module.exports = __toCommonJS(extract_exports);
var cheerio = __toESM(require("cheerio"), 1);
var import_fallback = __toESM(require("./fallback.js"), 1);
var import_fields = __toESM(require("./fields.js"), 1);
var import_media = require("./media.js");
var import_utils = require("./utils.js");
const extractMetaTags = (body, options) => {
  let ogObject = {};
  const $ = cheerio.load(body);
  const metaFields = import_fields.default.concat(options.customMetaTags || []);
  $("meta").each((index, meta) => {
    if (!meta.attribs || !meta.attribs.property && !meta.attribs.name) return;
    const property = meta.attribs.property || meta.attribs.name;
    const content = meta.attribs.content || meta.attribs.value;
    metaFields.forEach((item) => {
      if (property.toLowerCase() === item.property.toLowerCase()) {
        if (!item.multiple) {
          ogObject[item.fieldName] = content;
        } else if (!ogObject[item.fieldName]) {
          ogObject[item.fieldName] = [content];
        } else if (Array.isArray(ogObject[item.fieldName])) {
          ogObject[item.fieldName].push(content);
        }
      }
    });
  });
  if (!ogObject.ogImage && ogObject.ogImageSecureURL) {
    ogObject.ogImage = ogObject.ogImageSecureURL;
  } else if (!ogObject.ogImage && ogObject.ogImageURL) {
    ogObject.ogImage = ogObject.ogImageURL;
  }
  ogObject = (0, import_media.mediaSetup)(ogObject, options);
  if (!options.onlyGetOpenGraphInfo) {
    ogObject = (0, import_fallback.default)(ogObject, options, $);
  }
  return (0, import_utils.removeNestedUndefinedValues)(ogObject);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  extractMetaTags
});
//# sourceMappingURL=extract.cjs.map