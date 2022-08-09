const ogs = require('../../index');

describe('url', function () {
  it('http', function () {
    return ogs({
      url: 'http://www.wikipedia.org/',
    }, function (error, result, response) {
      console.log('error:', error);
      console.log('result:', result);
      expect(error).to.be.eql(false);
      expect(result.ogTitle).to.be.eql('WikipediaCloseCloseCloseCloseCloseClose');
      expect(result.ogDescription).to.be.eql('Wikipedia is a free online encyclopedia, created and edited by volunteers around the world and hosted by the Wikimedia Foundation.');
      expect(result.ogLocale).to.be.eql('mul');
      expect(result.requestUrl).to.be.eql('http://www.wikipedia.org/');
      expect(result.charset).to.be.eql('utf8');
      expect(result.success).to.be.eql(true);
      expect(result).to.have.all.keys(
        'ogDescription',
        'ogLocale',
        'ogTitle',
        'requestUrl',
        'success',
        'charset',
      );
      expect(response).to.be.an('Response').and.to.not.be.empty;
    });
  });
  it('https', function () {
    return ogs({
      url: 'https://www.wikipedia.org/',
    }, function (error, result, response) {
      console.log('error:', error);
      console.log('result:', result);
      expect(error).to.be.eql(false);
      expect(result.ogTitle).to.be.eql('WikipediaCloseCloseCloseCloseCloseClose');
      expect(result.ogDescription).to.be.eql('Wikipedia is a free online encyclopedia, created and edited by volunteers around the world and hosted by the Wikimedia Foundation.');
      expect(result.ogLocale).to.be.eql('mul');
      expect(result.requestUrl).to.be.eql('https://www.wikipedia.org/');
      expect(result.charset).to.be.eql('utf8');
      expect(result.success).to.be.eql(true);
      expect(result).to.have.all.keys(
        'ogDescription',
        'ogLocale',
        'ogTitle',
        'requestUrl',
        'success',
        'charset',
      );
      expect(response).to.be.an('Response').and.to.not.be.empty;
    });
  });
  it('no protocol', function () {
    return ogs({
      url: 'www.wikipedia.org/',
    }, function (error, result, response) {
      console.log('error:', error);
      console.log('result:', result);
      expect(error).to.be.eql(false);
      expect(result.ogTitle).to.be.eql('WikipediaCloseCloseCloseCloseCloseClose');
      expect(result.ogDescription).to.be.eql('Wikipedia is a free online encyclopedia, created and edited by volunteers around the world and hosted by the Wikimedia Foundation.');
      expect(result.ogLocale).to.be.eql('mul');
      expect(result.requestUrl).to.be.eql('http://www.wikipedia.org/');
      expect(result.charset).to.be.eql('utf8');
      expect(result.success).to.be.eql(true);
      expect(result).to.have.all.keys(
        'ogDescription',
        'ogLocale',
        'ogTitle',
        'requestUrl',
        'success',
        'charset',
      );
      expect(response).to.be.an('Response').and.to.not.be.empty;
    });
  });
  it('no protocol and no wwww', function () {
    return ogs({
      url: 'wikipedia.org/',
    }, function (error, result, response) {
      console.log('error:', error);
      console.log('result:', result);
      expect(error).to.be.eql(false);
      expect(result.ogTitle).to.be.eql('WikipediaCloseCloseCloseCloseCloseClose');
      expect(result.ogDescription).to.be.eql('Wikipedia is a free online encyclopedia, created and edited by volunteers around the world and hosted by the Wikimedia Foundation.');
      expect(result.ogLocale).to.be.eql('mul');
      expect(result.requestUrl).to.be.eql('http://wikipedia.org/');
      expect(result.charset).to.be.eql('utf8');
      expect(result.success).to.be.eql(true);
      expect(result).to.have.all.keys(
        'ogDescription',
        'ogLocale',
        'ogTitle',
        'requestUrl',
        'success',
        'charset',
      );
      expect(response).to.be.an('Response').and.to.not.be.empty;
    });
  });
  it('protocol with no wwww', function () {
    return ogs({
      url: 'http://wikipedia.org/',
    }, function (error, result, response) {
      console.log('error:', error);
      console.log('result:', result);
      expect(error).to.be.eql(false);
      expect(result.ogTitle).to.be.eql('WikipediaCloseCloseCloseCloseCloseClose');
      expect(result.ogLocale).to.be.eql('mul');
      expect(result.ogDescription).to.be.eql('Wikipedia is a free online encyclopedia, created and edited by volunteers around the world and hosted by the Wikimedia Foundation.');
      expect(result.requestUrl).to.be.eql('http://wikipedia.org/');
      expect(result.charset).to.be.eql('utf8');
      expect(result.success).to.be.eql(true);
      expect(result).to.have.all.keys(
        'ogDescription',
        'ogLocale',
        'ogTitle',
        'requestUrl',
        'success',
        'charset',
      );
      expect(response).to.be.an('Response').and.to.not.be.empty;
    });
  });
  it('fake page', function () {
    return ogs({
      url: 'http://testtesttest4564568.com',
    }, function (error, result, response) {
      console.log('error:', error);
      console.log('result:', result);
      expect(error).to.be.eql(true);
      expect(result.success).to.be.eql(false);
      expect(result.requestUrl).to.be.eql('http://testtesttest4564568.com');
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
  it('empty url', function () {
    return ogs({
      url: '',
    }, function (error, result, response) {
      console.log('error:', error);
      console.log('result:', result);
      expect(error).to.be.eql(true);
      expect(result.success).to.be.eql(false);
      expect(result.requestUrl).to.be.eql('');
      expect(result.error).to.eql('Invalid URL');
      expect(result.errorDetails.toString()).to.eql('Error: Invalid URL');
      expect(result).to.have.all.keys(
        'error',
        'errorDetails',
        'requestUrl',
        'success',
      );
      expect(response).to.eql(undefined);
    });
  });
  it('empty options', function () {
    return ogs({}, function (error, result, response) {
      console.log('error:', error);
      console.log('result:', result);
      expect(error).to.be.eql(true);
      expect(result.success).to.be.eql(false);
      expect(result.requestUrl).to.eql(undefined);
      expect(result.error).to.eql('Invalid URL');
      expect(result.errorDetails.toString()).to.eql('Error: Invalid URL');
      expect(result).to.have.all.keys(
        'error',
        'errorDetails',
        'requestUrl',
        'success',
      );
      expect(response).to.eql(undefined);
    });
  });
  it('url is just a number', function () {
    return ogs({
      url: 23233,
    }, function (error, result, response) {
      console.log('error:', error);
      console.log('result:', result);
      expect(error).to.be.eql(true);
      expect(result.success).to.be.eql(false);
      expect(result.requestUrl).to.be.eql(23233);
      expect(result.error).to.eql('Invalid URL');
      expect(result.errorDetails.toString()).to.eql('Error: Invalid URL');
      expect(result).to.have.all.keys(
        'error',
        'errorDetails',
        'requestUrl',
        'success',
      );
      expect(response).to.eql(undefined);
    });
  });
  it('url is a string of numbers', function () {
    return ogs({
      url: '2323233',
    }, function (error, result, response) {
      console.log('error:', error);
      console.log('result:', result);
      expect(error).to.be.eql(true);
      expect(result.success).to.be.eql(false);
      expect(result.requestUrl).to.be.eql('2323233');
      expect(result.error).to.eql('Invalid URL');
      expect(result.errorDetails.toString()).to.eql('Error: Invalid URL');
      expect(result).to.have.all.keys(
        'error',
        'errorDetails',
        'requestUrl',
        'success',
      );
      expect(response).to.eql(undefined);
    });
  });
  it('url is a string of words', function () {
    return ogs({
      url: 'this is a test',
    }, function (error, result, response) {
      console.log('error:', error);
      console.log('result:', result);
      expect(error).to.be.eql(true);
      expect(result.success).to.be.eql(false);
      expect(result.requestUrl).to.be.eql('this is a test');
      expect(result.error).to.eql('Invalid URL');
      expect(result.errorDetails.toString()).to.eql('Error: Invalid URL');
      expect(result).to.have.all.keys(
        'error',
        'errorDetails',
        'requestUrl',
        'success',
      );
      expect(response).to.eql(undefined);
    });
  });
  it('url is invalid because user disallows https with urlValidatorSettings', function () {
    return ogs({
      url: 'https://www.wikipedia.org/',
      urlValidatorSettings: {
        protocols: ['http'],
        require_tld: true,
        require_protocol: false,
        require_host: true,
        require_valid_protocol: true,
        allow_underscores: false,
        host_whitelist: false,
        host_blacklist: false,
        allow_trailing_dot: false,
        allow_protocol_relative_urls: false,
        disallow_auth: false,
      },
    }, function (error, result, response) {
      console.log('error:', error);
      console.log('result:', result);
      expect(error).to.be.eql(true);
      expect(result.success).to.be.eql(false);
      expect(result.requestUrl).to.be.eql('https://www.wikipedia.org/');
      expect(result.error).to.eql('Invalid URL');
      expect(result.errorDetails.toString()).to.eql('Error: Invalid URL');
      expect(result).to.have.all.keys(
        'error',
        'errorDetails',
        'requestUrl',
        'success',
      );
      expect(response).to.eql(undefined);
    });
  });
  it('url is to a pdf', function () {
    return ogs({
      url: 'test.pdf?123',
    }, function (error, result, response) {
      console.log('error:', error);
      console.log('result:', result);
      expect(error).to.be.eql(true);
      expect(result.success).to.be.eql(false);
      expect(result.requestUrl).to.be.eql('http://test.pdf?123');
      expect(result.error).to.eql('Must scrape an HTML page');
      expect(result.errorDetails.toString()).to.eql('Error: Must scrape an HTML page');
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
