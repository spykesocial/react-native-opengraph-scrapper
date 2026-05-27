import validator from 'validator';

const isUrlValid = (url: unknown, urlValidatorSettings?: Record<string, unknown>): url is string => (
  typeof url === 'string'
  && url.length > 0
  && validator.isURL(url, urlValidatorSettings)
);

const coerceUrl = (url: string) => (/^(f|ht)tps?:\/\//i.test(url) ? url : `http://${url}`);

const isTimeoutValid = (timeout: unknown): timeout is number => (
  typeof timeout === 'number' && /^\d{1,10}$/.test(String(timeout))
);

export const validate = (
  url: unknown,
  timeout: unknown,
  urlValidatorSettings?: Record<string, unknown>,
) => ({
  url: isUrlValid(url, urlValidatorSettings) ? coerceUrl(url) : null,
  timeout: isTimeoutValid(timeout) ? timeout : 2000,
});

export const findImageTypeFromUrl = (url: string) => {
  let type = url.split('.').pop() || '';
  [type] = type.split('?');
  return type;
};

export const isImageTypeValid = (type: string) => {
  const validImageTypes = [
    'apng',
    'bmp',
    'gif',
    'ico',
    'cur',
    'jpg',
    'jpeg',
    'jfif',
    'pjpeg',
    'pjp',
    'png',
    'svg',
    'tif',
    'tiff',
    'webp',
  ];
  return validImageTypes.includes(type);
};

export const isThisANonHTMLUrl = (url: string) => {
  const invalidImageTypes = [
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.ppt',
    '.pptx',
    '.3gp',
    '.avi',
    '.mov',
    '.mp4',
    '.m4v',
    '.m4a',
    '.mp3',
    '.mkv',
    '.ogv',
    '.ogm',
    '.ogg',
    '.oga',
    '.webm',
    '.wav',
    '.bmp',
    '.gif',
    '.jpg',
    '.jpeg',
    '.png',
    '.webp',
    '.zip',
    '.rar',
    '.tar',
    '.tar.gz',
    '.tgz',
    '.tar.bz2',
    '.tbz2',
    '.txt',
    '.pdf',
  ];
  const extension = findImageTypeFromUrl(url);
  return invalidImageTypes.some((type) => `.${extension}`.includes(type));
};

export const removeNestedUndefinedValues = <T extends Record<string, unknown>>(object: T): T => {
  Object.entries(object).forEach(([key, value]) => {
    if (value && typeof value === 'object') removeNestedUndefinedValues(value as Record<string, unknown>);
    else if (value === undefined) delete object[key];
  });
  return object;
};

export { isUrlValid };
