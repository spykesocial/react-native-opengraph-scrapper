import { c as OpenGraphScraperOptions, I as InternalScraperResult } from './types-B2RmHjS0.js';

declare const requestAndResultsFormatter: (options: OpenGraphScraperOptions & {
    url: string;
    timeout: number;
    headers: Record<string, string>;
    peekSize: number;
}) => Promise<InternalScraperResult>;

export { requestAndResultsFormatter };
