import * as cheerio from 'cheerio';
import fallback from './fallback.js';
import fields from './fields.js';
import { mediaSetup } from './media.js';
import type { OpenGraphResult, OpenGraphScraperOptions } from './types.js';
import { removeNestedUndefinedValues } from './utils.js';

export const extractMetaTags = (body: string, options: OpenGraphScraperOptions) => {
  let ogObject: OpenGraphResult = {};
  const $ = cheerio.load(body);
  const metaFields = fields.concat(options.customMetaTags || []);

  $('meta').each((index, meta) => {
    if (!meta.attribs || (!meta.attribs.property && !meta.attribs.name)) return;
    const property = meta.attribs.property || meta.attribs.name;
    const content = meta.attribs.content || meta.attribs.value;
    metaFields.forEach((item) => {
      if (property.toLowerCase() === item.property.toLowerCase()) {
        if (!item.multiple) {
          ogObject[item.fieldName] = content;
        } else if (!ogObject[item.fieldName]) {
          ogObject[item.fieldName] = [content];
        } else if (Array.isArray(ogObject[item.fieldName])) {
          (ogObject[item.fieldName] as unknown[]).push(content);
        }
      }
    });
  });

  if (!ogObject.ogImage && ogObject.ogImageSecureURL) {
    ogObject.ogImage = ogObject.ogImageSecureURL as string | string[];
  } else if (!ogObject.ogImage && ogObject.ogImageURL) {
    ogObject.ogImage = ogObject.ogImageURL as string | string[];
  }

  ogObject = mediaSetup(ogObject, options);

  if (!options.onlyGetOpenGraphInfo) {
    ogObject = fallback(ogObject, options, $);
  }

  return removeNestedUndefinedValues(ogObject);
};
