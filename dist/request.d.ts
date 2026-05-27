import { c as OpenGraphScraperOptions, I as InternalScraperResult } from './types-Cq5gc-92.js';

declare const requestAndResultsFormatter: (options: OpenGraphScraperOptions & {
    url: string;
    timeout: number;
    headers: Record<string, string>;
    peekSize: number;
}) => Promise<InternalScraperResult>;

export { requestAndResultsFormatter };
