import type { CheerioAPI } from 'cheerio';
import type { OpenGraphResult, OpenGraphScraperOptions } from './types.js';
import { findImageTypeFromUrl, isImageTypeValid, isUrlValid } from './utils.js';

const doesElementExist = (selector: unknown, attribute: string, $: CheerioAPI) => (
  $(selector as never).attr(attribute) && $(selector as never).attr(attribute)!.length > 0
);

const fallback = (ogObject: OpenGraphResult, options: OpenGraphScraperOptions, $: CheerioAPI) => {
  if (!ogObject.ogTitle) {
    if ($('title').text() && $('title').text().length > 0) {
      ogObject.ogTitle = $('title').text();
    } else if ($('head > meta[name="title"]').attr('content') && $('head > meta[name="title"]').attr('content')!.length > 0) {
      ogObject.ogTitle = $('head > meta[name="title"]').attr('content');
    } else if ($('.post-title').text() && $('.post-title').text().length > 0) {
      ogObject.ogTitle = $('.post-title').text();
    } else if ($('.entry-title').text() && $('.entry-title').text().length > 0) {
      ogObject.ogTitle = $('.entry-title').text();
    } else if ($('h1[class*="title" i] a').text() && $('h1[class*="title" i] a').text().length > 0) {
      ogObject.ogTitle = $('h1[class*="title" i] a').text();
    } else if ($('h1[class*="title" i]').text() && $('h1[class*="title" i]').text().length > 0) {
      ogObject.ogTitle = $('h1[class*="title" i]').text();
    }
  }

  if (!ogObject.ogDescription) {
    if (doesElementExist('head > meta[name="description"]', 'content', $)) {
      ogObject.ogDescription = $('head > meta[name="description"]').attr('content');
    } else if (doesElementExist('head > meta[itemprop="description"]', 'content', $)) {
      ogObject.ogDescription = $('head > meta[itemprop="description"]').attr('content');
    } else if ($('#description').text() && $('#description').text().length > 0) {
      ogObject.ogDescription = $('#description').text();
    }
  }

  if (!ogObject.ogImage && options.ogImageFallback) {
    ogObject.ogImage = [];
    $('img').map((index, imageElement) => {
      if (doesElementExist(imageElement, 'src', $)) {
        const source = $(imageElement).attr('src')!;
        const type = findImageTypeFromUrl(source);
        if (!isUrlValid(source, options.urlValidatorSettings) || !isImageTypeValid(type)) return false;
        (ogObject.ogImage as unknown[]).push({
          url: source,
          width: $(imageElement).attr('width') || null,
          height: $(imageElement).attr('height') || null,
          type,
        });
      }
      return false;
    });
    if ((ogObject.ogImage as unknown[]).length === 0) delete ogObject.ogImage;
  } else if (ogObject.ogImage) {
    if (Array.isArray(ogObject.ogImage)) {
      ogObject.ogImage.map((image) => {
        if (typeof image === 'object' && image && image.url && !image.type) {
          const type = findImageTypeFromUrl(image.url);
          if (isImageTypeValid(type)) image.type = type;
        }
        return false;
      });
    } else if (typeof ogObject.ogImage === 'object' && ogObject.ogImage) {
      const image = ogObject.ogImage as { url?: string; type?: string };
      if (image.url && !image.type) {
        const type = findImageTypeFromUrl(image.url);
        if (isImageTypeValid(type)) image.type = type;
      }
    }
  }

  if (!ogObject.ogAudioURL && !ogObject.ogAudioSecureURL) {
    const audioElementValue = $('audio').attr('src');
    const audioSourceElementValue = $('audio > source').attr('src');
    if (doesElementExist('audio', 'src', $) && audioElementValue) {
      if (audioElementValue.startsWith('https')) {
        ogObject.ogAudioSecureURL = audioElementValue;
      } else {
        ogObject.ogAudioURL = audioElementValue;
      }
      const audioElementTypeValue = $('audio').attr('type');
      if (!ogObject.ogAudioType && doesElementExist('audio', 'type', $)) ogObject.ogAudioType = audioElementTypeValue;
    } else if (doesElementExist('audio > source', 'src', $) && audioSourceElementValue) {
      if (audioSourceElementValue.startsWith('https')) {
        ogObject.ogAudioSecureURL = audioSourceElementValue;
      } else {
        ogObject.ogAudioURL = audioSourceElementValue;
      }
      const audioSourceElementTypeValue = $('audio > source').attr('type');
      if (!ogObject.ogAudioType && doesElementExist('audio > source', 'type', $)) ogObject.ogAudioType = audioSourceElementTypeValue;
    }
  }

  if (!ogObject.ogLocale) {
    if (doesElementExist('html', 'lang', $)) {
      ogObject.ogLocale = $('html').attr('lang');
    } else if (doesElementExist('head > meta[itemprop="inLanguage"]', 'content', $)) {
      ogObject.ogLocale = $('head > meta[itemprop="inLanguage"]').attr('content');
    }
  }

  if (!ogObject.ogLogo) {
    if (doesElementExist('meta[itemprop="logo"]', 'content', $)) {
      ogObject.ogLogo = $('meta[itemprop="logo"]').attr('content');
    } else if (doesElementExist('img[itemprop="logo"]', 'src', $)) {
      ogObject.ogLogo = $('img[itemprop="logo"]').attr('src');
    }
  }

  if (!ogObject.ogUrl) {
    if (doesElementExist('link[rel="canonical"]', 'href', $)) {
      ogObject.ogUrl = $('link[rel="canonical"]').attr('href');
    } else if (doesElementExist('link[rel="alternate"][hreflang="x-default"]', 'href', $)) {
      ogObject.ogUrl = $('link[rel="alternate"][hreflang="x-default"]').attr('href');
    }
  }

  if (!ogObject.ogDate) {
    if (doesElementExist('head > meta[name="date"]', 'content', $)) {
      ogObject.ogDate = $('head > meta[name="date"]').attr('content');
    } else if (doesElementExist('[itemprop*="datemodified" i]', 'content', $)) {
      ogObject.ogDate = $('[itemprop*="datemodified" i]').attr('content');
    } else if (doesElementExist('[itemprop="datepublished" i]', 'content', $)) {
      ogObject.ogDate = $('[itemprop="datepublished" i]').attr('content');
    } else if (doesElementExist('[itemprop*="date" i]', 'content', $)) {
      ogObject.ogDate = $('[itemprop*="date" i]').attr('content');
    } else if (doesElementExist('time[itemprop*="date" i]', 'datetime', $)) {
      ogObject.ogDate = $('time[itemprop*="date" i]').attr('datetime');
    } else if (doesElementExist('time[datetime]', 'datetime', $)) {
      ogObject.ogDate = $('time[datetime]').attr('datetime');
    }
  }

  return ogObject;
};

export default fallback;
