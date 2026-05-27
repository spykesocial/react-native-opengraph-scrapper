import { c as OpenGraphScraperOptions, b as OpenGraphScraperCallback, d as PromiseScraperSuccess } from './types-B2RmHjS0.cjs';
export { M as MediaResult, a as MetaTagDefinition, O as OpenGraphResult, P as PromiseScraperResult, S as ScraperResponse } from './types-B2RmHjS0.cjs';

declare function run(options: OpenGraphScraperOptions, callback: OpenGraphScraperCallback): Promise<void>;
declare function run(options: OpenGraphScraperOptions): Promise<PromiseScraperSuccess>;

export { OpenGraphScraperCallback, OpenGraphScraperOptions, run as default, run };
