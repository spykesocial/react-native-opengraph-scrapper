import type { ExpectStatic } from 'chai';
import type SinonType from 'sinon';
import type {
  MediaResult, MediaValue, OpenGraphResult, ScraperResponse,
} from '../src/types.js';

declare global {
  // eslint-disable-next-line no-var, vars-on-top
  var expect: ExpectStatic;
  // eslint-disable-next-line no-var, vars-on-top
  var sinon: typeof SinonType;
  // eslint-disable-next-line no-var, vars-on-top
  var mediaResult: (value: MediaValue | undefined) => MediaResult;
  // eslint-disable-next-line no-var, vars-on-top
  var mediaResults: (value: MediaValue | undefined) => MediaResult[];

  interface Error {
    code?: string;
  }

  // eslint-disable-next-line no-var, vars-on-top
  var scraperError: (result: OpenGraphResult) => Error;
  // eslint-disable-next-line no-var, vars-on-top
  var scraperResponse: (response: ScraperResponse | undefined) => ScraperResponse;

  namespace NodeJS {
    interface Process {
      browser?: boolean;
    }
  }
}

export {};
