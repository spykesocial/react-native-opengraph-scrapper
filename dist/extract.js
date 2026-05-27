import * as cheerio from "cheerio";
import fallback from "./fallback.js";
import fields from "./fields.js";
import { mediaSetup } from "./media.js";
import { removeNestedUndefinedValues } from "./utils.js";
const extractMetaTags = (body, options) => {
  let ogObject = {};
  const $ = cheerio.load(body);
  const metaFields = fields.concat(options.customMetaTags || []);
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
  ogObject = mediaSetup(ogObject, options);
  if (!options.onlyGetOpenGraphInfo) {
    ogObject = fallback(ogObject, options, $);
  }
  return removeNestedUndefinedValues(ogObject);
};
export {
  extractMetaTags
};
//# sourceMappingURL=extract.js.map