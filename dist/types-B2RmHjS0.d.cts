interface MetaTagDefinition {
    multiple: boolean;
    property: string;
    fieldName: string;
}
interface OpenGraphScraperOptions {
    url?: string;
    html?: string;
    timeout?: number;
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
type OpenGraphResult = Record<string, unknown> & {
    requestUrl?: string | null;
    success?: boolean;
    error?: string;
    errorDetails?: Error | unknown;
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
    ogImage?: unknown;
    ogVideo?: unknown;
    twitterImage?: unknown;
    twitterPlayer?: unknown;
    musicSong?: unknown;
};
type ScraperResponse = Response | {
    body: string;
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
type OpenGraphScraperCallback = (error: boolean, result: OpenGraphResult, response?: ScraperResponse) => void;

export type { InternalScraperResult as I, MediaResult as M, OpenGraphResult as O, PromiseScraperResult as P, ScraperResponse as S, MetaTagDefinition as a, OpenGraphScraperCallback as b, OpenGraphScraperOptions as c, PromiseScraperSuccess as d };
