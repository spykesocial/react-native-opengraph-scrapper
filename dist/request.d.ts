import { d as OpenGraphScraperOptions, I as InternalScraperResult } from './types-CoN5ZJ1u.js';

declare const requestAndResultsFormatter: (options: OpenGraphScraperOptions & {
    url: string;
    timeout: number;
    headers: Record<string, string>;
    peekSize: number;
}) => Promise<InternalScraperResult>;

export { requestAndResultsFormatter };
