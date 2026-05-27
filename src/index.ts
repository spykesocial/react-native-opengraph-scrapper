import openGraphScraperLite from './openGraphScraperLite.js';
import type {
  OpenGraphResult,
  OpenGraphScraperCallback,
  OpenGraphScraperOptions,
  PromiseScraperError,
  PromiseScraperSuccess,
} from './types.js';

const buildErrorResult = (options: OpenGraphScraperOptions, exception: unknown): OpenGraphResult => ({
  success: false,
  requestUrl: options.url,
  error: exception instanceof Error ? exception.message : String(exception),
  errorDetails: exception,
});

export async function run(
  options: OpenGraphScraperOptions,
  callback: OpenGraphScraperCallback,
): Promise<void>;
export async function run(options: OpenGraphScraperOptions): Promise<PromiseScraperSuccess>;
export async function run(
  options: OpenGraphScraperOptions,
  callback?: OpenGraphScraperCallback,
): Promise<PromiseScraperSuccess | void> {
  const hasCallback = typeof callback === 'function';

  if (hasCallback) {
    try {
      const results = await openGraphScraperLite(options);
      callback(false, results.ogObject, results.response);
      return undefined;
    } catch (exception) {
      callback(true, buildErrorResult(options, exception));
      return undefined;
    }
  }

  try {
    const results = await openGraphScraperLite(options);
    return {
      error: false,
      result: results.ogObject,
      response: results.response,
    };
  } catch (exception) {
    const returnError: PromiseScraperError = {
      error: true,
      result: buildErrorResult(options, exception),
    };
    return Promise.reject(returnError);
  }
}

export default run;
export type {
  MediaResult,
  MetaTagDefinition,
  OpenGraphResult,
  OpenGraphScraperCallback,
  OpenGraphScraperOptions,
  PromiseScraperResult,
  ScraperResponse,
} from './types.js';
