import { extractMetaTags } from './extract.js';
import { requestAndResultsFormatter } from './request.js';
import type { InternalScraperResult, OpenGraphScraperOptions } from './types.js';
import { isThisANonHTMLUrl, validate } from './utils.js';

const defaultUrlValidatorSettings = {
  protocols: ['http', 'https'],
  require_tld: true,
  require_protocol: false,
  require_host: true,
  require_valid_protocol: true,
  allow_underscores: false,
  host_whitelist: false,
  host_blacklist: false,
  allow_trailing_dot: false,
  allow_protocol_relative_urls: false,
  disallow_auth: false,
};

function normalizeScraperError(exception: unknown): never {
  if (
    exception
    && typeof exception === 'object'
    && 'code' in exception
    && ['ENOTFOUND', 'EHOSTUNREACH', 'ENETUNREACH'].includes(String(exception.code))
  ) {
    throw new Error('Page not found');
  }
  if (
    exception
    && typeof exception === 'object'
    && 'code' in exception
    && ['ERR_INVALID_URL', 'EINVAL'].includes(String(exception.code))
  ) {
    throw new Error('Page not found');
  }
  if (exception instanceof Error && exception.message === 'fetch failed') {
    throw new Error('Page not found');
  }
  if (exception && typeof exception === 'object' && 'code' in exception && exception.code === 'ETIMEDOUT') {
    throw new Error('Time out');
  }
  if (exception instanceof Error && exception.message === 'Request timed out') {
    throw new Error('Time out');
  }
  if (exception && typeof exception === 'object' && 'name' in exception && exception.name === 'AbortError') {
    throw new Error('Time out');
  }
  if (exception instanceof Error && exception.message.startsWith('Response code 4')) {
    throw new Error('Page not found');
  }
  if (exception instanceof Error && exception.message === 'Forbidden') {
    throw new Error('Page not found');
  }
  if (exception instanceof Error && exception.message.startsWith('Response code 5')) {
    throw new Error('Web server is returning error');
  }
  if (exception instanceof Error && exception.message === 'Internal Server Error') {
    throw new Error('Web server is returning error');
  }
  if (exception instanceof Error) throw exception;
  throw new Error('Page not found');
}

const setOptionsAndReturnOpenGraphResults = async (
  options: OpenGraphScraperOptions,
): Promise<InternalScraperResult> => {
  options.customMetaTags = options.customMetaTags || [];

  if (options.html) {
    if (options.url) throw new Error('Must specify either `url` or `html`, not both');
    const ogObject = extractMetaTags(options.html, options);
    if (!options.onlyGetOpenGraphInfo) {
      ogObject.charset = 'utf8';
    }
    ogObject.requestUrl = null;
    ogObject.success = true;
    return {
      ogObject,
      response: {
        body: options.html,
        ok: true,
        status: 200,
        text: async () => options.html || '',
      } as Response & { body: string },
    };
  }

  if (!options.urlValidatorSettings) {
    options.urlValidatorSettings = defaultUrlValidatorSettings;
  }

  const validated = validate(options.url, options.timeout, options.urlValidatorSettings);

  if (!validated.url) throw new Error('Invalid URL');

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
    timeout: options.timeout,
  };

  if (isThisANonHTMLUrl(requestOptions.url)) throw new Error('Must scrape an HTML page');

  if (
    requestOptions.blacklist
    && requestOptions.blacklist.some((blacklistedHostname) => requestOptions.url.includes(blacklistedHostname))
  ) {
    throw new Error('Host name has been black listed');
  }

  try {
    return await requestAndResultsFormatter(requestOptions);
  } catch (exception) {
    normalizeScraperError(exception);
  }
};

export default setOptionsAndReturnOpenGraphResults;
