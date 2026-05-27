export interface MetaTagDefinition {
  multiple: boolean;
  property: string;
  fieldName: string;
}

export interface OpenGraphScraperOptions {
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

export interface MediaResult {
  url?: string | null;
  width?: string | null;
  height?: string | null;
  type?: string | null;
  alt?: string | null;
  stream?: string | null;
  track?: string | null;
  disc?: string | null;
}

export type OpenGraphResult = Record<string, unknown> & {
  requestUrl?: string | null;
  success?: boolean;
  error?: string;
  errorDetails?: unknown;
  ogImage?: unknown;
  ogVideo?: unknown;
  twitterImage?: unknown;
  twitterPlayer?: unknown;
  musicSong?: unknown;
};

export type ScraperResponse = Response | {
  body: string;
  text?: () => Promise<string>;
};

export interface InternalScraperResult {
  ogObject: OpenGraphResult;
  response: ScraperResponse;
}

export interface PromiseScraperSuccess {
  error: false;
  result: OpenGraphResult;
  response: ScraperResponse;
}

export interface PromiseScraperError {
  error: true;
  result: OpenGraphResult;
  response?: undefined;
}

export type PromiseScraperResult = PromiseScraperSuccess;

export type OpenGraphScraperCallback = (
  error: boolean,
  result: OpenGraphResult,
  response?: ScraperResponse,
) => void;
