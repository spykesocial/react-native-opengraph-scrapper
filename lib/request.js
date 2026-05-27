/* eslint-disable import/no-unresolved */
const chardet = require('chardet');

const charset = require('./charset');
const { extractMetaTags } = require('./extract');

function headersToObject(responseHeaders) {
  const headers = {};
  if (responseHeaders && typeof responseHeaders.forEach === 'function') {
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
    clearTimeout: () => clearTimeout(timeoutId),
  };
}

/*
 * request and results formatter
 * @param string options - options the user has set
 */
exports.requestAndResultsFormatter = async (options) => {
  const requestUrl = options.url;
  const fetchOptions = buildFetchOptions(options);

  let response;
  try {
    response = await fetch(requestUrl, {
      headers: fetchOptions.headers,
      signal: fetchOptions.signal,
    });
  } finally {
    fetchOptions.clearTimeout();
  }

  let formatBody = await response.text();

  if (response && response.status && response.status.toString().substring(0, 1) === '4') {
    throw new Error(`Response code ${response.status}`);
  }
  if (response && response.status && response.status.toString().substring(0, 1) === '5') {
    throw new Error(`Response code ${response.status}`);
  }
  if (formatBody === undefined || formatBody === '') {
    throw new Error('Page not found');
  }

  const responseHeaders = headersToObject(response.headers);
  const char = charset.find(responseHeaders, formatBody, options.peekSize) || chardet.detect(formatBody);

  const ogObject = extractMetaTags(formatBody, options);

  if (!options.onlyGetOpenGraphInfo) {
    ogObject.charset = char;
  }
  ogObject.requestUrl = options.url;
  ogObject.success = true;

  return { ogObject, response };
};
