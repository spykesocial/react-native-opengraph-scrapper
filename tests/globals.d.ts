import type { expect as ExpectFn } from 'chai';
import type SinonType from 'sinon';
import type {
  MediaResult, MediaValue, OpenGraphResult, ScraperResponse,
} from '../src/types.js';

declare global {
  var expect: typeof ExpectFn;
  var sinon: typeof SinonType;
  var mediaResult: (value: MediaValue | undefined) => MediaResult;
  var mediaResults: (value: MediaValue | undefined) => MediaResult[];

  interface Error {
    code?: string;
  }

  var scraperError: (result: OpenGraphResult) => Error;
  var scraperResponse: (response: ScraperResponse | undefined) => ScraperResponse;

  namespace NodeJS {
    interface Process {
      browser?: boolean;
    }
  }
}

export {};
