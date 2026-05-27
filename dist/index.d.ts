import { d as OpenGraphScraperOptions, c as OpenGraphScraperCallback, e as PromiseScraperSuccess } from './types-CoN5ZJ1u.js';
export { M as MediaResult, a as MediaValue, b as MetaTagDefinition, O as OpenGraphResult, P as PromiseScraperResult, S as ScraperResponse } from './types-CoN5ZJ1u.js';

declare function run(options: OpenGraphScraperOptions, callback: OpenGraphScraperCallback): Promise<void>;
declare function run(options: OpenGraphScraperOptions): Promise<PromiseScraperSuccess>;

export { OpenGraphScraperCallback, OpenGraphScraperOptions, run as default, run };
