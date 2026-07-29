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

// src/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default,
  run: () => run
});
module.exports = __toCommonJS(index_exports);

// src/extract.ts
var cheerio = __toESM(require("cheerio"), 1);

// src/utils.ts
var import_validator = __toESM(require("validator"), 1);
var isUrlValid = (url, urlValidatorSettings) => typeof url === "string" && url.length > 0 && import_validator.default.isURL(url, urlValidatorSettings);
var coerceUrl = (url) => /^(f|ht)tps?:\/\//i.test(url) ? url : `http://${url}`;
var isTimeoutValid = (timeout) => typeof timeout === "number" && /^\d{1,10}$/.test(String(timeout));
var validate = (url, timeout, urlValidatorSettings) => ({
  url: isUrlValid(url, urlValidatorSettings) ? coerceUrl(url) : null,
  timeout: isTimeoutValid(timeout) ? timeout : 2e3
});
var findImageTypeFromUrl = (url) => {
  let type = url.split(".").pop() || "";
  [type] = type.split("?");
  return type;
};
var isImageTypeValid = (type) => {
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
var isThisANonHTMLUrl = (url) => {
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
var removeNestedUndefinedValues = (object) => {
  Object.entries(object).forEach(([key, value]) => {
    if (value && typeof value === "object") removeNestedUndefinedValues(value);
    else if (value === void 0) delete object[key];
  });
  return object;
};

// src/fallback.ts
var doesElementExist = (selector, attribute, $) => $(selector).attr(attribute) && $(selector).attr(attribute).length > 0;
var fallback = (ogObject, options, $) => {
  if (!ogObject.ogTitle) {
    if ($("title").text() && $("title").text().length > 0) {
      ogObject.ogTitle = $("title").text();
    } else if ($('head > meta[name="title"]').attr("content") && $('head > meta[name="title"]').attr("content").length > 0) {
      ogObject.ogTitle = $('head > meta[name="title"]').attr("content");
    } else if ($(".post-title").text() && $(".post-title").text().length > 0) {
      ogObject.ogTitle = $(".post-title").text();
    } else if ($(".entry-title").text() && $(".entry-title").text().length > 0) {
      ogObject.ogTitle = $(".entry-title").text();
    } else if ($('h1[class*="title" i] a').text() && $('h1[class*="title" i] a').text().length > 0) {
      ogObject.ogTitle = $('h1[class*="title" i] a').text();
    } else if ($('h1[class*="title" i]').text() && $('h1[class*="title" i]').text().length > 0) {
      ogObject.ogTitle = $('h1[class*="title" i]').text();
    }
  }
  if (!ogObject.ogDescription) {
    if (doesElementExist('head > meta[name="description"]', "content", $)) {
      ogObject.ogDescription = $('head > meta[name="description"]').attr("content");
    } else if (doesElementExist('head > meta[itemprop="description"]', "content", $)) {
      ogObject.ogDescription = $('head > meta[itemprop="description"]').attr("content");
    } else if ($("#description").text() && $("#description").text().length > 0) {
      ogObject.ogDescription = $("#description").text();
    }
  }
  if (!ogObject.ogImage && options.ogImageFallback) {
    ogObject.ogImage = [];
    $("img").map((index, imageElement) => {
      if (doesElementExist(imageElement, "src", $)) {
        const source = $(imageElement).attr("src");
        const type = findImageTypeFromUrl(source);
        if (!isUrlValid(source, options.urlValidatorSettings) || !isImageTypeValid(type)) return false;
        ogObject.ogImage.push({
          url: source,
          width: $(imageElement).attr("width") || null,
          height: $(imageElement).attr("height") || null,
          type
        });
      }
      return false;
    });
    if (ogObject.ogImage.length === 0) delete ogObject.ogImage;
  } else if (ogObject.ogImage) {
    if (Array.isArray(ogObject.ogImage)) {
      ogObject.ogImage.map((image) => {
        if (typeof image === "object" && image && image.url && !image.type) {
          const type = findImageTypeFromUrl(image.url);
          if (isImageTypeValid(type)) image.type = type;
        }
        return false;
      });
    } else if (typeof ogObject.ogImage === "object" && ogObject.ogImage) {
      const image = ogObject.ogImage;
      if (image.url && !image.type) {
        const type = findImageTypeFromUrl(image.url);
        if (isImageTypeValid(type)) image.type = type;
      }
    }
  }
  if (!ogObject.ogAudioURL && !ogObject.ogAudioSecureURL) {
    const audioElementValue = $("audio").attr("src");
    const audioSourceElementValue = $("audio > source").attr("src");
    if (doesElementExist("audio", "src", $) && audioElementValue) {
      if (audioElementValue.startsWith("https")) {
        ogObject.ogAudioSecureURL = audioElementValue;
      } else {
        ogObject.ogAudioURL = audioElementValue;
      }
      const audioElementTypeValue = $("audio").attr("type");
      if (!ogObject.ogAudioType && doesElementExist("audio", "type", $)) ogObject.ogAudioType = audioElementTypeValue;
    } else if (doesElementExist("audio > source", "src", $) && audioSourceElementValue) {
      if (audioSourceElementValue.startsWith("https")) {
        ogObject.ogAudioSecureURL = audioSourceElementValue;
      } else {
        ogObject.ogAudioURL = audioSourceElementValue;
      }
      const audioSourceElementTypeValue = $("audio > source").attr("type");
      if (!ogObject.ogAudioType && doesElementExist("audio > source", "type", $)) ogObject.ogAudioType = audioSourceElementTypeValue;
    }
  }
  if (!ogObject.ogLocale) {
    if (doesElementExist("html", "lang", $)) {
      ogObject.ogLocale = $("html").attr("lang");
    } else if (doesElementExist('head > meta[itemprop="inLanguage"]', "content", $)) {
      ogObject.ogLocale = $('head > meta[itemprop="inLanguage"]').attr("content");
    }
  }
  if (!ogObject.ogLogo) {
    if (doesElementExist('meta[itemprop="logo"]', "content", $)) {
      ogObject.ogLogo = $('meta[itemprop="logo"]').attr("content");
    } else if (doesElementExist('img[itemprop="logo"]', "src", $)) {
      ogObject.ogLogo = $('img[itemprop="logo"]').attr("src");
    }
  }
  if (!ogObject.ogUrl) {
    if (doesElementExist('link[rel="canonical"]', "href", $)) {
      ogObject.ogUrl = $('link[rel="canonical"]').attr("href");
    } else if (doesElementExist('link[rel="alternate"][hreflang="x-default"]', "href", $)) {
      ogObject.ogUrl = $('link[rel="alternate"][hreflang="x-default"]').attr("href");
    }
  }
  if (!ogObject.ogDate) {
    if (doesElementExist('head > meta[name="date"]', "content", $)) {
      ogObject.ogDate = $('head > meta[name="date"]').attr("content");
    } else if (doesElementExist('[itemprop*="datemodified" i]', "content", $)) {
      ogObject.ogDate = $('[itemprop*="datemodified" i]').attr("content");
    } else if (doesElementExist('[itemprop="datepublished" i]', "content", $)) {
      ogObject.ogDate = $('[itemprop="datepublished" i]').attr("content");
    } else if (doesElementExist('[itemprop*="date" i]', "content", $)) {
      ogObject.ogDate = $('[itemprop*="date" i]').attr("content");
    } else if (doesElementExist('time[itemprop*="date" i]', "datetime", $)) {
      ogObject.ogDate = $('time[itemprop*="date" i]').attr("datetime");
    } else if (doesElementExist("time[datetime]", "datetime", $)) {
      ogObject.ogDate = $("time[datetime]").attr("datetime");
    }
  }
  return ogObject;
};
var fallback_default = fallback;

// src/fields.ts
var fields = [
  {
    multiple: false,
    property: "og:title",
    fieldName: "ogTitle"
  },
  {
    multiple: false,
    property: "og:type",
    fieldName: "ogType"
  },
  {
    multiple: false,
    property: "og:logo",
    fieldName: "ogLogo"
  },
  {
    multiple: true,
    property: "og:image",
    fieldName: "ogImage"
  },
  {
    multiple: true,
    property: "og:image:url",
    fieldName: "ogImageURL"
  },
  {
    multiple: true,
    property: "og:image:secure_url",
    fieldName: "ogImageSecureURL"
  },
  {
    multiple: true,
    property: "og:image:width",
    fieldName: "ogImageWidth"
  },
  {
    multiple: true,
    property: "og:image:height",
    fieldName: "ogImageHeight"
  },
  {
    multiple: true,
    property: "og:image:type",
    fieldName: "ogImageType"
  },
  {
    multiple: false,
    property: "og:url",
    fieldName: "ogUrl"
  },
  {
    multiple: false,
    property: "og:audio",
    fieldName: "ogAudio"
  },
  {
    multiple: false,
    property: "og:audio:url",
    fieldName: "ogAudioURL"
  },
  {
    multiple: false,
    property: "og:audio:secure_url",
    fieldName: "ogAudioSecureURL"
  },
  {
    multiple: false,
    property: "og:audio:type",
    fieldName: "ogAudioType"
  },
  {
    multiple: false,
    property: "og:description",
    fieldName: "ogDescription"
  },
  {
    multiple: false,
    property: "og:determiner",
    fieldName: "ogDeterminer"
  },
  {
    multiple: false,
    property: "og:locale",
    fieldName: "ogLocale"
  },
  {
    multiple: false,
    property: "og:locale:alternate",
    fieldName: "ogLocaleAlternate"
  },
  {
    multiple: false,
    property: "og:site_name",
    fieldName: "ogSiteName"
  },
  {
    multiple: false,
    property: "og:product:retailer_item_id",
    fieldName: "ogProductRetailerItemId"
  },
  {
    multiple: false,
    property: "og:product:price:amount",
    fieldName: "ogProductPriceAmount"
  },
  {
    multiple: false,
    property: "og:product:price:currency",
    fieldName: "ogProductPriceCurrency"
  },
  {
    multiple: false,
    property: "og:product:availability",
    fieldName: "ogProductAvailability"
  },
  {
    multiple: false,
    property: "og:product:condition",
    fieldName: "ogProductCondition"
  },
  {
    multiple: false,
    property: "og:price:amount",
    fieldName: "ogPriceAmount"
  },
  {
    multiple: false,
    property: "og:price:currency",
    fieldName: "ogPriceCurrency"
  },
  {
    multiple: false,
    property: "og:availability",
    fieldName: "ogAvailability"
  },
  {
    multiple: true,
    property: "og:video",
    fieldName: "ogVideo"
  },
  {
    multiple: true,
    property: "og:video:url",
    // An alternative to 'og:video'
    fieldName: "ogVideo"
  },
  {
    multiple: true,
    property: "og:video:secure_url",
    fieldName: "ogVideoSecureURL"
  },
  {
    multiple: true,
    property: "og:video:actor:id",
    fieldName: "ogVideoActorId"
  },
  {
    multiple: true,
    property: "og:video:width",
    fieldName: "ogVideoWidth"
  },
  {
    multiple: true,
    property: "og:video:height",
    fieldName: "ogVideoHeight"
  },
  {
    multiple: true,
    property: "og:video:type",
    fieldName: "ogVideoType"
  },
  {
    multiple: false,
    property: "twitter:card",
    fieldName: "twitterCard"
  },
  {
    multiple: false,
    property: "twitter:url",
    fieldName: "twitterUrl"
  },
  {
    multiple: false,
    property: "twitter:site",
    fieldName: "twitterSite"
  },
  {
    multiple: false,
    property: "twitter:site:id",
    fieldName: "twitterSiteId"
  },
  {
    multiple: false,
    property: "twitter:creator",
    fieldName: "twitterCreator"
  },
  {
    multiple: false,
    property: "twitter:creator:id",
    fieldName: "twitterCreatorId"
  },
  {
    multiple: false,
    property: "twitter:title",
    fieldName: "twitterTitle"
  },
  {
    multiple: false,
    property: "twitter:description",
    fieldName: "twitterDescription"
  },
  {
    multiple: true,
    property: "twitter:image",
    fieldName: "twitterImage"
  },
  {
    multiple: true,
    property: "twitter:image:height",
    fieldName: "twitterImageHeight"
  },
  {
    multiple: true,
    property: "twitter:image:width",
    fieldName: "twitterImageWidth"
  },
  {
    multiple: true,
    property: "twitter:image:src",
    fieldName: "twitterImageSrc"
  },
  {
    multiple: true,
    property: "twitter:image:alt",
    fieldName: "twitterImageAlt"
  },
  {
    multiple: true,
    property: "twitter:player",
    fieldName: "twitterPlayer"
  },
  {
    multiple: true,
    property: "twitter:player:width",
    fieldName: "twitterPlayerWidth"
  },
  {
    multiple: true,
    property: "twitter:player:height",
    fieldName: "twitterPlayerHeight"
  },
  {
    multiple: true,
    property: "twitter:player:stream",
    fieldName: "twitterPlayerStream"
  },
  {
    multiple: true,
    property: "twitter:player:stream:content_type",
    fieldName: "twitterPlayerStreamContentType"
  },
  {
    multiple: false,
    property: "twitter:app:name:iphone",
    fieldName: "twitterAppNameiPhone"
  },
  {
    multiple: false,
    property: "twitter:app:id:iphone",
    fieldName: "twitterAppIdiPhone"
  },
  {
    multiple: false,
    property: "twitter:app:url:iphone",
    fieldName: "twitterAppUrliPhone"
  },
  {
    multiple: false,
    property: "twitter:app:name:ipad",
    fieldName: "twitterAppNameiPad"
  },
  {
    multiple: false,
    property: "twitter:app:id:ipad",
    fieldName: "twitterAppIdiPad"
  },
  {
    multiple: false,
    property: "twitter:app:url:ipad",
    fieldName: "twitterAppUrliPad"
  },
  {
    multiple: false,
    property: "twitter:app:name:googleplay",
    fieldName: "twitterAppNameGooglePlay"
  },
  {
    multiple: false,
    property: "twitter:app:id:googleplay",
    fieldName: "twitterAppIdGooglePlay"
  },
  {
    multiple: false,
    property: "twitter:app:url:googleplay",
    fieldName: "twitterAppUrlGooglePlay"
  },
  {
    multiple: true,
    property: "music:song",
    fieldName: "musicSong"
  },
  {
    multiple: true,
    property: "music:song:disc",
    fieldName: "musicSongDisc"
  },
  {
    multiple: true,
    property: "music:song:track",
    fieldName: "musicSongTrack"
  },
  {
    multiple: true,
    property: "music:song:url",
    fieldName: "musicSongUrl"
  },
  {
    multiple: true,
    property: "music:musician",
    fieldName: "musicMusician"
  },
  {
    multiple: false,
    property: "music:release_date",
    fieldName: "musicReleaseDate"
  },
  {
    multiple: false,
    property: "music:duration",
    fieldName: "musicDuration"
  },
  {
    multiple: true,
    property: "music:creator",
    fieldName: "musicCreator"
  },
  {
    multiple: true,
    property: "music:album",
    fieldName: "musicAlbum"
  },
  {
    multiple: false,
    property: "music:album:disc",
    fieldName: "musicAlbumDisc"
  },
  {
    multiple: false,
    property: "music:album:track",
    fieldName: "musicAlbumTrack"
  },
  {
    multiple: false,
    property: "music:album:url",
    fieldName: "musicAlbumUrl"
  },
  {
    multiple: false,
    property: "article:published_time",
    fieldName: "articlePublishedTime"
  },
  {
    multiple: false,
    property: "article:modified_time",
    fieldName: "articleModifiedTime"
  },
  {
    multiple: false,
    property: "article:expiration_time",
    fieldName: "articleExpirationTime"
  },
  {
    multiple: false,
    property: "article:author",
    fieldName: "articleAuthor"
  },
  {
    multiple: false,
    property: "article:section",
    fieldName: "articleSection"
  },
  {
    multiple: false,
    property: "article:tag",
    fieldName: "articleTag"
  },
  {
    multiple: false,
    property: "article:publisher",
    fieldName: "articlePublisher"
  },
  {
    multiple: false,
    property: "og:article:published_time",
    fieldName: "ogArticlePublishedTime"
  },
  {
    multiple: false,
    property: "og:article:modified_time",
    fieldName: "ogArticleModifiedTime"
  },
  {
    multiple: false,
    property: "og:article:expiration_time",
    fieldName: "ogArticleExpirationTime"
  },
  {
    multiple: false,
    property: "og:article:author",
    fieldName: "ogArticleAuthor"
  },
  {
    multiple: false,
    property: "og:article:section",
    fieldName: "ogArticleSection"
  },
  {
    multiple: false,
    property: "og:article:tag",
    fieldName: "ogArticleTag"
  },
  {
    multiple: false,
    property: "og:article:publisher",
    fieldName: "ogArticlePublisher"
  },
  {
    multiple: false,
    property: "books:book",
    fieldName: "booksBook"
  },
  {
    multiple: false,
    property: "book:author",
    fieldName: "bookAuthor"
  },
  {
    multiple: false,
    property: "book:isbn",
    fieldName: "bookIsbn"
  },
  {
    multiple: false,
    property: "book:release_date",
    fieldName: "bookReleaseDate"
  },
  {
    multiple: false,
    property: "book:canonical_name",
    fieldName: "bookCanonicalName"
  },
  {
    multiple: false,
    property: "book:tag",
    fieldName: "bookTag"
  },
  {
    multiple: false,
    property: "books:rating:value",
    fieldName: "booksRatingValue"
  },
  {
    multiple: false,
    property: "books:rating:scale",
    fieldName: "booksRatingScale"
  },
  {
    multiple: false,
    property: "profile:first_name",
    fieldName: "profileFirstName"
  },
  {
    multiple: false,
    property: "profile:last_name",
    fieldName: "profileLastName"
  },
  {
    multiple: false,
    property: "profile:username",
    fieldName: "profileUsername"
  },
  {
    multiple: false,
    property: "profile:gender",
    fieldName: "profileGender"
  },
  {
    multiple: false,
    property: "business:contact_data:street_address",
    fieldName: "businessContactDataStreetAddress"
  },
  {
    multiple: false,
    property: "business:contact_data:locality",
    fieldName: "businessContactDataLocality"
  },
  {
    multiple: false,
    property: "business:contact_data:region",
    fieldName: "businessContactDataRegion"
  },
  {
    multiple: false,
    property: "business:contact_data:postal_code",
    fieldName: "businessContactDataPostalCode"
  },
  {
    multiple: false,
    property: "business:contact_data:country_name",
    fieldName: "businessContactDataCountryName"
  },
  {
    multiple: false,
    property: "restaurant:menu",
    fieldName: "restaurantMenu"
  },
  {
    multiple: false,
    property: "restaurant:restaurant",
    fieldName: "restaurantRestaurant"
  },
  {
    multiple: false,
    property: "restaurant:section",
    fieldName: "restaurantSection"
  },
  {
    multiple: false,
    property: "restaurant:variation:price:amount",
    fieldName: "restaurantVariationPriceAmount"
  },
  {
    multiple: false,
    property: "restaurant:variation:price:currency",
    fieldName: "restaurantVariationPriceCurrency"
  },
  {
    multiple: false,
    property: "restaurant:contact_info:website",
    fieldName: "restaurantContactInfoWebsite"
  },
  {
    multiple: false,
    property: "restaurant:contact_info:street_address",
    fieldName: "restaurantContactInfoStreetAddress"
  },
  {
    multiple: false,
    property: "restaurant:contact_info:locality",
    fieldName: "restaurantContactInfoLocality"
  },
  {
    multiple: false,
    property: "restaurant:contact_info:region",
    fieldName: "restaurantContactInfoRegion"
  },
  {
    multiple: false,
    property: "restaurant:contact_info:postal_code",
    fieldName: "restaurantContactInfoPostalCode"
  },
  {
    multiple: false,
    property: "restaurant:contact_info:country_name",
    fieldName: "restaurantContactInfoCountryName"
  },
  {
    multiple: false,
    property: "restaurant:contact_info:email",
    fieldName: "restaurantContactInfoEmail"
  },
  {
    multiple: false,
    property: "restaurant:contact_info:phone_number",
    fieldName: "restaurantContactInfoPhoneNumber"
  },
  {
    multiple: false,
    property: "place:location:latitude",
    fieldName: "placeLocationLatitude"
  },
  {
    multiple: false,
    property: "place:location:longitude",
    fieldName: "placeLocationLongitude"
  },
  {
    multiple: false,
    property: "og:date",
    fieldName: "ogDate"
  },
  {
    multiple: false,
    property: "author",
    fieldName: "author"
  },
  {
    multiple: false,
    property: "updated_time",
    fieldName: "updatedTime"
  },
  {
    multiple: false,
    property: "modified_time",
    fieldName: "modifiedTime"
  },
  {
    multiple: false,
    property: "published_time",
    fieldName: "publishedTime"
  },
  {
    multiple: false,
    property: "release_date",
    fieldName: "releaseDate"
  },
  {
    multiple: false,
    property: "dc.source",
    fieldName: "dcSource"
  },
  {
    multiple: false,
    property: "dc.subject",
    fieldName: "dcSubject"
  },
  {
    multiple: false,
    property: "dc.title",
    fieldName: "dcTitle"
  },
  {
    multiple: false,
    property: "dc.type",
    fieldName: "dcType"
  },
  {
    multiple: false,
    property: "dc.creator",
    fieldName: "dcCreator"
  },
  {
    multiple: false,
    property: "dc.coverage",
    fieldName: "dcCoverage"
  },
  {
    multiple: false,
    property: "dc.language",
    fieldName: "dcLanguage"
  },
  {
    multiple: false,
    property: "dc.contributor",
    fieldName: "dcContributor"
  },
  {
    multiple: false,
    property: "dc.date",
    fieldName: "dcDate"
  },
  {
    multiple: false,
    property: "dc.date.issued",
    fieldName: "dcDateIssued"
  },
  {
    multiple: false,
    property: "dc.date.created",
    fieldName: "dcDateCreated"
  },
  {
    multiple: false,
    property: "dc.description",
    fieldName: "dcDescription"
  },
  {
    multiple: false,
    property: "dc.identifier",
    fieldName: "dcIdentifier"
  },
  {
    multiple: false,
    property: "dc.publisher",
    fieldName: "dcPublisher"
  },
  {
    multiple: false,
    property: "dc.rights",
    fieldName: "dcRights"
  },
  {
    multiple: false,
    property: "dc.relation",
    fieldName: "dcRelation"
  },
  {
    multiple: false,
    property: "dc.format.media",
    fieldName: "dcFormatMedia"
  },
  {
    multiple: false,
    property: "dc.format.size",
    fieldName: "dcFormatSize"
  },
  {
    multiple: false,
    property: "al:ios:url",
    fieldName: "alIosUrl"
  },
  {
    multiple: false,
    property: "al:ios:app_store_id",
    fieldName: "alIosAppStoreId"
  },
  {
    multiple: false,
    property: "al:ios:app_name",
    fieldName: "alIosAppName"
  },
  {
    multiple: false,
    property: "al:iphone:url",
    fieldName: "alIphoneUrl"
  },
  {
    multiple: false,
    property: "al:iphone:app_store_id",
    fieldName: "alIphoneAppStoreId"
  },
  {
    multiple: false,
    property: "al:iphone:app_name",
    fieldName: "alIphoneAppName"
  },
  {
    multiple: false,
    property: "al:ipad:url",
    fieldName: "alIpadUrl"
  },
  {
    multiple: false,
    property: "al:ipad:app_store_id",
    fieldName: "alIpadAppStoreId"
  },
  {
    multiple: false,
    property: "al:ipad:app_name",
    fieldName: "alIpadAppName"
  },
  {
    multiple: false,
    property: "al:android:url",
    fieldName: "alAndroidUrl"
  },
  {
    multiple: false,
    property: "al:android:package",
    fieldName: "alAndroidPackage"
  },
  {
    multiple: false,
    property: "al:android:class",
    fieldName: "alAndroidClass"
  },
  {
    multiple: false,
    property: "al:android:app_name",
    fieldName: "alAndroidAppName"
  },
  {
    multiple: false,
    property: "al:windows_phone:url",
    fieldName: "alWindowsPhoneUrl"
  },
  {
    multiple: false,
    property: "al:windows_phone:app_id",
    fieldName: "alWindowsPhoneAppId"
  },
  {
    multiple: false,
    property: "al:windows_phone:app_name",
    fieldName: "alWindowsPhoneAppName"
  },
  {
    multiple: false,
    property: "al:windows:url",
    fieldName: "alWindowsUrl"
  },
  {
    multiple: false,
    property: "al:windows:app_id",
    fieldName: "alWindowsAppId"
  },
  {
    multiple: false,
    property: "al:windows:app_name",
    fieldName: "alWindowsAppName"
  },
  {
    multiple: false,
    property: "al:windows_universal:url",
    fieldName: "alWindowsUniversalUrl"
  },
  {
    multiple: false,
    property: "al:windows_universal:app_id",
    fieldName: "alWindowsUniversalAppId"
  },
  {
    multiple: false,
    property: "al:windows_universal:app_name",
    fieldName: "alWindowsUniversalAppName"
  },
  {
    multiple: false,
    property: "al:web:url",
    fieldName: "alWebUrl"
  },
  {
    multiple: false,
    property: "al:web:should_fallback",
    fieldName: "alWebShouldFallback"
  }
];
var fields_default = fields;

// src/media.ts
var mediaMapperTwitterImage = (item) => ({
  url: item[0],
  width: item[1],
  height: item[2],
  alt: item[3]
});
var mediaMapperTwitterPlayer = (item) => ({
  url: item[0],
  width: item[1],
  height: item[2],
  stream: item[3]
});
var mediaMapperMusicSong = (item) => ({
  url: item[0],
  track: item[1],
  disc: item[2]
});
var mediaMapper = (item) => ({
  url: item[0],
  width: item[1],
  height: item[2],
  type: item[3]
});
var mediaSorter = (a, b) => {
  if (!(a.url && b.url)) {
    return 0;
  }
  const aRes = a.url.match(/\.(\w{2,5})$/);
  const aExt = aRes && aRes[1].toLowerCase() || null;
  const bRes = b.url.match(/\.(\w{2,5})$/);
  const bExt = bRes && bRes[1].toLowerCase() || null;
  if (aExt === "gif" && bExt !== "gif") {
    return -1;
  }
  if (aExt !== "gif" && bExt === "gif") {
    return 1;
  }
  return Math.max(Number(b.width), Number(b.height)) - Math.max(Number(a.width), Number(a.height));
};
var mediaSorterMusicSong = (a, b) => {
  if (!(a.track && b.track)) {
    return 0;
  }
  if (Number(a.disc) > Number(b.disc)) {
    return 1;
  }
  if (Number(a.disc) < Number(b.disc)) {
    return -1;
  }
  return Number(a.track) - Number(b.track);
};
var toArray = (value) => Array.isArray(value) ? value : void 0;
var zip = (array, ...args) => {
  if (array === void 0) return [];
  return array.map((value, idx) => [value, ...args.map((arr) => arr?.[idx])]);
};
var mediaSetup = (ogObject, options) => {
  const meta = ogObject;
  if (meta.ogImage || meta.ogImageWidth || meta.twitterImageHeight || meta.ogImageType) {
    meta.ogImage = meta.ogImage ? meta.ogImage : [null];
    meta.ogImageWidth = meta.ogImageWidth ? meta.ogImageWidth : [null];
    meta.ogImageHeight = meta.ogImageHeight ? meta.ogImageHeight : [null];
    meta.ogImageType = meta.ogImageType ? meta.ogImageType : [null];
  }
  const ogImages = zip(
    toArray(meta.ogImage),
    toArray(meta.ogImageWidth),
    toArray(meta.ogImageHeight),
    toArray(meta.ogImageType)
  ).map(mediaMapper).sort(mediaSorter);
  if (meta.ogVideo || meta.ogVideoWidth || meta.ogVideoHeight || meta.ogVideoType) {
    meta.ogVideo = meta.ogVideo ? meta.ogVideo : [null];
    meta.ogVideoWidth = meta.ogVideoWidth ? meta.ogVideoWidth : [null];
    meta.ogVideoHeight = meta.ogVideoHeight ? meta.ogVideoHeight : [null];
    meta.ogVideoType = meta.ogVideoType ? meta.ogVideoType : [null];
  }
  const ogVideos = zip(
    toArray(meta.ogVideo),
    toArray(meta.ogVideoWidth),
    toArray(meta.ogVideoHeight),
    toArray(meta.ogVideoType)
  ).map(mediaMapper).sort(mediaSorter);
  if (meta.twitterImageSrc || meta.twitterImage || meta.twitterImageWidth || meta.twitterImageHeight || meta.twitterImageAlt) {
    meta.twitterImageSrc = meta.twitterImageSrc ? meta.twitterImageSrc : [null];
    meta.twitterImage = meta.twitterImage ? meta.twitterImage : meta.twitterImageSrc;
    meta.twitterImageWidth = meta.twitterImageWidth ? meta.twitterImageWidth : [null];
    meta.twitterImageHeight = meta.twitterImageHeight ? meta.twitterImageHeight : [null];
    meta.twitterImageAlt = meta.twitterImageAlt ? meta.twitterImageAlt : [null];
  }
  const twitterImages = zip(
    toArray(meta.twitterImage),
    toArray(meta.twitterImageWidth),
    toArray(meta.twitterImageHeight),
    toArray(meta.twitterImageAlt)
  ).map(mediaMapperTwitterImage).sort(mediaSorter);
  if (meta.twitterPlayer || meta.twitterPlayerWidth || meta.twitterPlayerHeight || meta.twitterPlayerStream) {
    meta.twitterPlayer = meta.twitterPlayer ? meta.twitterPlayer : [null];
    meta.twitterPlayerWidth = meta.twitterPlayerWidth ? meta.twitterPlayerWidth : [null];
    meta.twitterPlayerHeight = meta.twitterPlayerHeight ? meta.twitterPlayerHeight : [null];
    meta.twitterPlayerStream = meta.twitterPlayerStream ? meta.twitterPlayerStream : [null];
  }
  const twitterPlayers = zip(
    toArray(meta.twitterPlayer),
    toArray(meta.twitterPlayerWidth),
    toArray(meta.twitterPlayerHeight),
    toArray(meta.twitterPlayerStream)
  ).map(mediaMapperTwitterPlayer).sort(mediaSorter);
  if (meta.musicSong || meta.musicSongTrack || meta.musicSongDisc) {
    meta.musicSong = meta.musicSong ? meta.musicSong : [null];
    meta.musicSongTrack = meta.musicSongTrack ? meta.musicSongTrack : [null];
    meta.musicSongDisc = meta.musicSongDisc ? meta.musicSongDisc : [null];
  }
  const musicSongs = zip(
    toArray(meta.musicSong),
    toArray(meta.musicSongTrack),
    toArray(meta.musicSongDisc)
  ).map(mediaMapperMusicSong).sort(mediaSorterMusicSong);
  fields_default.filter((item) => item.multiple && item.fieldName && item.fieldName.match("(ogImage|ogVideo|twitter|musicSong).*")).forEach((item) => {
    delete meta[item.fieldName];
  });
  if (options.allMedia) {
    if (ogImages.length) ogObject.ogImage = ogImages;
    if (ogVideos.length) ogObject.ogVideo = ogVideos;
    if (twitterImages.length) ogObject.twitterImage = twitterImages;
    if (twitterPlayers.length) ogObject.twitterPlayer = twitterPlayers;
    if (musicSongs.length) ogObject.musicSong = musicSongs;
  } else {
    if (ogImages.length) [ogObject.ogImage] = ogImages;
    if (ogVideos.length) [ogObject.ogVideo] = ogVideos;
    if (twitterImages.length) [ogObject.twitterImage] = twitterImages;
    if (twitterPlayers.length) [ogObject.twitterPlayer] = twitterPlayers;
    if (musicSongs.length) [ogObject.musicSong] = musicSongs;
  }
  return ogObject;
};

// src/extract.ts
var extractMetaTags = (body, options) => {
  let ogObject = {};
  const $ = cheerio.load(body);
  const metaFields = fields_default.concat(options.customMetaTags || []);
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
    ogObject = fallback_default(ogObject, options, $);
  }
  return removeNestedUndefinedValues(ogObject);
};

// src/request.ts
var chardet = __toESM(require("chardet"), 1);

// src/charset.ts
var CHARTSET_RE = /(?:charset|encoding)\s{0,10}=\s{0,10}['"]? {0,10}([\w-]{1,100})/i;
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

// src/request.ts
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
    const detectedCharset = find(responseHeaders, preview, peekSize) || chardet.detect(bytes) || "utf8";
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
    charset: find(responseHeaders, body, peekSize) || chardet.detect(body)
  };
}
var requestAndResultsFormatter = async (options) => {
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

// src/openGraphScraperLite.ts
var defaultUrlValidatorSettings = {
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
var setOptionsAndReturnOpenGraphResults = async (options) => {
  options.customMetaTags = options.customMetaTags || [];
  if (options.html) {
    if (options.url) throw new Error("Must specify either `url` or `html`, not both");
    const ogObject = extractMetaTags(options.html, options);
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
  const validated = validate(options.url, options.timeout, options.urlValidatorSettings);
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
  if (isThisANonHTMLUrl(requestOptions.url)) throw new Error("Must scrape an HTML page");
  if (requestOptions.blacklist && requestOptions.blacklist.some((blacklistedHostname) => requestOptions.url.includes(blacklistedHostname))) {
    throw new Error("Host name has been black listed");
  }
  try {
    return await requestAndResultsFormatter(requestOptions);
  } catch (exception) {
    normalizeScraperError(exception);
  }
};

// src/index.ts
var buildErrorResult = (options, exception) => ({
  success: false,
  requestUrl: options.url,
  error: exception instanceof Error ? exception.message : String(exception),
  errorDetails: exception instanceof Error ? exception : new Error(String(exception))
});
async function run(options, callback) {
  const hasCallback = typeof callback === "function";
  if (hasCallback) {
    try {
      const results = await setOptionsAndReturnOpenGraphResults(options);
      callback(false, results.ogObject, results.response);
      return void 0;
    } catch (exception) {
      callback(true, buildErrorResult(options, exception));
      return void 0;
    }
  }
  try {
    const results = await setOptionsAndReturnOpenGraphResults(options);
    return {
      error: false,
      result: results.ogObject,
      response: results.response
    };
  } catch (exception) {
    const returnError = {
      error: true,
      result: buildErrorResult(options, exception)
    };
    return Promise.reject(returnError);
  }
}
var index_default = run;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  run
});
//# sourceMappingURL=index.cjs.map