interface MetaTagDefinition {
    multiple: boolean;
    property: string;
    fieldName: string;
}
type MediaValue = MediaResult | MediaResult[];
interface OpenGraphScraperOptions {
    url?: string | number;
    html?: string;
    timeout?: number | string;
    blacklist?: string[];
    onlyGetOpenGraphInfo?: boolean;
    ogImageFallback?: boolean;
    allMedia?: boolean;
    retry?: number;
    headers?: Record<string, string>;
    peekSize?: number;
    customMetaTags?: MetaTagDefinition[];
    urlValidatorSettings?: Record<string, unknown>;
    encoding?: string | null;
}
interface MediaResult {
    url?: string | null;
    width?: string | null;
    height?: string | null;
    type?: string | null;
    alt?: string | null;
    stream?: string | null;
    track?: string | null;
    disc?: string | null;
}
interface OpenGraphResult {
    requestUrl?: string | number | null;
    success?: boolean;
    error?: string;
    errorDetails?: Error;
    ogTitle?: string;
    ogDescription?: string;
    ogLocale?: string;
    ogUrl?: string;
    ogDate?: string;
    ogLogo?: string;
    ogAudioURL?: string;
    ogAudioSecureURL?: string;
    ogAudioType?: string;
    charset?: string | null;
    ogImage?: MediaValue;
    ogVideo?: MediaValue;
    twitterImage?: MediaValue;
    twitterPlayer?: MediaValue;
    musicSong?: MediaValue;
    [key: string]: unknown;
}
type ScraperResponse = Response | {
    body: string;
    ok?: boolean;
    status?: number;
    text?: () => Promise<string>;
};
interface InternalScraperResult {
    ogObject: OpenGraphResult;
    response: ScraperResponse;
}
interface PromiseScraperSuccess {
    error: false;
    result: OpenGraphResult;
    response: ScraperResponse;
}
type PromiseScraperResult = PromiseScraperSuccess;
interface OpenGraphScraperCallback {
    (error: false, result: OpenGraphResult, response: ScraperResponse): void;
    (error: true, result: OpenGraphResult, response?: undefined): void;
    (error: boolean, result: OpenGraphResult, response?: ScraperResponse): void;
}

export type { InternalScraperResult as I, MediaResult as M, OpenGraphResult as O, PromiseScraperResult as P, ScraperResponse as S, MediaValue as a, MetaTagDefinition as b, OpenGraphScraperCallback as c, OpenGraphScraperOptions as d, PromiseScraperSuccess as e };
