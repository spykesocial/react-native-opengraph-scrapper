const ogs = require('../../index');

describe('statusCode', function () {
  context('when the site returns', function () {
    it('200', function () {
      return ogs({
        url: 'https://ogp.me/',
        timeout: 10000,
      }, function (error, result, response) {
        console.log('error:', error);
        console.log('result:', result);
        expect(error).to.be.eql(false);
        expect(result.charset).to.be.eql('utf8');
        expect(result.success).to.be.eql(true);
        expect(result.requestUrl).to.be.eql('https://ogp.me/');
        expect(result).to.have.all.keys(
          'ogTitle',
          'ogType',
          'ogUrl',
          'ogDescription',
          'ogImage',
          'requestUrl',
          'success',
          'charset',
        );
        expect(response).to.have.property('ok', true);
      });
    });
    it('403', function () {
      return ogs({
        url: 'https://httpbingo.org/status/403',
        timeout: 10000,
      }, function (error, result, response) {
        console.log('error:', error);
        console.log('result:', result);
        expect(error).to.be.eql(true);
        expect(result.success).to.be.eql(false);
        expect(result.requestUrl).to.be.eql('https://httpbingo.org/status/403');
        expect(result.error).to.eql('Page not found');
        expect(result.errorDetails.toString()).to.eql('Error: Page not found');
        expect(result).to.have.all.keys(
          'error',
          'errorDetails',
          'requestUrl',
          'success',
        );
        expect(response).to.eql(undefined);
      });
    });
    it('500', function () {
      return ogs({
        url: 'https://httpbingo.org/status/500',
        timeout: 10000,
      }, function (error, result, response) {
        console.log('error:', error);
        console.log('result:', result);
        expect(error).to.be.eql(true);
        expect(result.success).to.be.eql(false);
        expect(result.requestUrl).to.be.eql('https://httpbingo.org/status/500');
        expect(result.error).to.eql('Web server is returning error');
        expect(result.errorDetails.toString()).to.eql('Error: Web server is returning error');
        expect(result).to.have.all.keys(
          'error',
          'errorDetails',
          'requestUrl',
          'success',
        );
        expect(response).to.eql(undefined);
      });
    });
  });
});
