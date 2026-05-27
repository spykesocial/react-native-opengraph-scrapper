import type { ExpectStatic } from 'chai';
import type SinonType from 'sinon';

declare global {
  // eslint-disable-next-line no-var, vars-on-top
  var expect: ExpectStatic;
  // eslint-disable-next-line no-var, vars-on-top
  var sinon: typeof SinonType;

  interface Error {
    code?: string;
  }

  namespace NodeJS {
    interface Process {
      browser?: boolean;
    }
  }
}

export {};
