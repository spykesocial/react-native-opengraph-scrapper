/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import sinon from 'sinon';
import type {
  MediaResult, MediaValue, OpenGraphResult, ScraperResponse,
} from '../../src/types.js';

globalThis.expect = chai.expect;
globalThis.sinon = sinon;
globalThis.mediaResult = (value: MediaValue | undefined) => value as MediaResult;
globalThis.mediaResults = (value: MediaValue | undefined) => value as MediaResult[];
globalThis.scraperError = (result: OpenGraphResult) => result.errorDetails as Error;
globalThis.scraperResponse = (response: ScraperResponse | undefined) => {
  if (!response) {
    throw new Error('Expected scraper response');
  }
  return response;
};
