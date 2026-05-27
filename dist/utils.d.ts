declare const isUrlValid: (url: unknown, urlValidatorSettings?: Record<string, unknown>) => url is string;
declare const validate: (url: unknown, timeout: unknown, urlValidatorSettings?: Record<string, unknown>) => {
    url: string | null;
    timeout: number;
};
declare const findImageTypeFromUrl: (url: string) => string;
declare const isImageTypeValid: (type: string) => boolean;
declare const isThisANonHTMLUrl: (url: string) => boolean;
declare const removeNestedUndefinedValues: <T extends Record<string, unknown>>(object: T) => T;

export { findImageTypeFromUrl, isImageTypeValid, isThisANonHTMLUrl, isUrlValid, removeNestedUndefinedValues, validate };
