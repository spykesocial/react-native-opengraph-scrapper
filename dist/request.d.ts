import type { InternalScraperResult, OpenGraphScraperOptions } from './types.js';
export declare const requestAndResultsFormatter: (options: OpenGraphScraperOptions & {
    url: string;
    timeout: number;
    headers: Record<string, string>;
    peekSize: number;
}) => Promise<InternalScraperResult>;
//# sourceMappingURL=request.d.ts.map