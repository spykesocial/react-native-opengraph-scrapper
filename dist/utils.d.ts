declare const isUrlValid: (url: unknown, urlValidatorSettings?: Record<string, unknown>) => url is string;
export declare const validate: (url: unknown, timeout: unknown, urlValidatorSettings?: Record<string, unknown>) => {
    url: string | null;
    timeout: number;
};
export declare const findImageTypeFromUrl: (url: string) => string;
export declare const isImageTypeValid: (type: string) => boolean;
export declare const isThisANonHTMLUrl: (url: string) => boolean;
export declare const removeNestedUndefinedValues: <T extends Record<string, unknown>>(object: T) => T;
export { isUrlValid };
//# sourceMappingURL=utils.d.ts.map