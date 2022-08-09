const validator = require('validator');

/*
 * validates the url
 * @param string var - the url we want to scrape
 */
const isUrlValid = (url, urlValidatorSettings) => typeof url === 'string' && url.length > 0 && validator.isURL(url, urlValidatorSettings);
exports.isUrlValid = isUrlValid;

/*
 * forces url to start with http://
 * @param string var - the url we want to scrape
 */
const coerceUrl = (url) => (/^(f|ht)tps?:\/\//i.test(url) ? url : `http://${url}`);

/*
 * validate timeout - how long should we wait for a request
 * @param number var - the time we want to wait
 */
const isTimeoutValid = (timeout) => typeof timeout === 'number' && /^\d{1,10}$/.test(timeout);

/*
 * validates url and timeout
 * @param string var - user input url and timeout
 */
exports.validate = (url, timeout, urlValidatorSettings) => ({
  url: isUrlValid(url, urlValidatorSettings) ? coerceUrl(url) : null,
  timeout: isTimeoutValid(timeout) ? timeout : 2000,
});

/*
 * findImageTypeFromUrl
 * @param string url - image url
 */
const findImageTypeFromUrl = (url) => {
  let type = url.split('.').pop();
  [type] = type.split('?');
  return type;
};
exports.findImageTypeFromUrl = findImageTypeFromUrl;

/*
 * isImageTypeValid
 * @param string type - image type
 */
exports.isImageTypeValid = (type) => {
  const validImageTypes = ['apng', 'bmp', 'gif', 'ico', 'cur', 'jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png', 'svg', 'tif', 'tiff', 'webp'];
  return validImageTypes.includes(type);
};

/*
 * isThisANonHTMLPage
 * @param string url - url of site
 */
exports.isThisANonHTMLUrl = (url) => {
  const invalidImageTypes = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.3gp', '.avi', '.mov', '.mp4', '.m4v', '.m4a', '.mp3', '.mkv', '.ogv', '.ogm', '.ogg', '.oga', '.webm', '.wav', '.bmp', '.gif', '.jpg', '.jpeg', '.png', '.webp', '.zip', '.rar', '.tar', '.tar.gz', '.tgz', '.tar.bz2', '.tbz2', '.txt', '.pdf'];
  const extension = findImageTypeFromUrl(url);
  return invalidImageTypes.some((type) => `.${extension}`.includes(type));
};

/*
 * removeNestedUndefinedValues
 * @param object object - an object
 */
const removeNestedUndefinedValues = (object) => {
  Object.entries(object).forEach(([key, value]) => {
    if (value && typeof value === 'object') removeNestedUndefinedValues(value);
    else if (value === undefined) delete object[key];
  });
  return object;
};

exports.removeNestedUndefinedValues = removeNestedUndefinedValues;