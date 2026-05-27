import ogs from '@spykesocial/react-native-opengraph-scrapper';

describe('timeout', function () {
  it('set to 2000', function () {
    return ogs({
      url: 'http://www.wikipedia.org/',
      timeout: 2000,
    }, function (error, result, response) {
      console.log('error:', error);
      console.log('result:', result);
      expect(error).to.be.eql(false);
      expect(result.ogTitle).to.be.eql('Wikipedia, the free encyclopedia');
      expect(result.ogDescription).to.be.eql('Wikipedia is a free online encyclopedia, created and edited by volunteers around the world and hosted by the Wikimedia Foundation.');
      expect(result.ogLocale).to.be.eql('en');
      expect(result.requestUrl).to.be.eql('http://www.wikipedia.org/');
      expect(result.charset).to.be.eql('utf8');
      expect(result.success).to.be.eql(true);
      expect(result).to.include.all.keys(
        'ogDescription',
        'ogLocale',
        'ogTitle',
        'requestUrl',
        'success',
        'charset',
      );
      expect(response).to.have.property('ok', true);
    });
  });
  it('set to 2', function () {
    return ogs({
      url: 'http://www.wikipedia.org/',
      timeout: 2,
    }, function (error, result, response) {
      console.log('error:', error);
      console.log('result:', result);
      expect(error).to.be.eql(true);
      expect(result.success).to.be.eql(false);
      expect(result.requestUrl).to.be.eql('http://www.wikipedia.org/');
      expect(result.error).to.eql('Time out');
      expect(result.errorDetails.toString()).to.eql('Error: Time out');
      expect(result).to.include.all.keys(
        'error',
        'errorDetails',
        'requestUrl',
        'success',
      );
      expect(response).to.eql(undefined);
    });
  });
  it('set to empty string', function () {
    return ogs({
      url: 'http://www.wikipedia.org/',
      timeout: '',
    }, function (error, result, response) {
      console.log('error:', error);
      console.log('result:', result);
      expect(error).to.be.eql(false);
      expect(result.ogTitle).to.be.eql('Wikipedia, the free encyclopedia');
      expect(result.ogDescription).to.be.eql('Wikipedia is a free online encyclopedia, created and edited by volunteers around the world and hosted by the Wikimedia Foundation.');
      expect(result.ogLocale).to.be.eql('en');
      expect(result.requestUrl).to.be.eql('http://www.wikipedia.org/');
      expect(result.charset).to.be.eql('utf8');
      expect(result.success).to.be.eql(true);
      expect(result).to.include.all.keys(
        'ogDescription',
        'ogLocale',
        'ogTitle',
        'requestUrl',
        'success',
        'charset',
      );
      expect(response).to.have.property('ok', true);
    });
  });
  it('set to a number string', function () {
    return ogs({
      url: 'http://www.wikipedia.org/',
      timeout: '2000',
    }, function (error, result, response) {
      console.log('error:', error);
      console.log('result:', result);
      expect(error).to.be.eql(false);
      expect(result.ogTitle).to.be.eql('Wikipedia, the free encyclopedia');
      expect(result.ogDescription).to.be.eql('Wikipedia is a free online encyclopedia, created and edited by volunteers around the world and hosted by the Wikimedia Foundation.');
      expect(result.ogLocale).to.be.eql('en');
      expect(result.requestUrl).to.be.eql('http://www.wikipedia.org/');
      expect(result.charset).to.be.eql('utf8');
      expect(result.success).to.be.eql(true);
      expect(result).to.include.all.keys(
        'ogDescription',
        'ogLocale',
        'ogTitle',
        'requestUrl',
        'success',
        'charset',
      );
      expect(response).to.have.property('ok', true);
    });
  });
  it('set to some random chars', function () {
    return ogs({
      url: 'http://www.wikipedia.org/',
      timeout: 'sdsdds',
    }, function (error, result, response) {
      console.log('error:', error);
      console.log('result:', result);
      expect(error).to.be.eql(false);
      expect(result.ogTitle).to.be.eql('Wikipedia, the free encyclopedia');
      expect(result.ogDescription).to.be.eql('Wikipedia is a free online encyclopedia, created and edited by volunteers around the world and hosted by the Wikimedia Foundation.');
      expect(result.ogLocale).to.be.eql('en');
      expect(result.requestUrl).to.be.eql('http://www.wikipedia.org/');
      expect(result.charset).to.be.eql('utf8');
      expect(result.success).to.be.eql(true);
      expect(result).to.include.all.keys(
        'ogDescription',
        'ogLocale',
        'ogTitle',
        'requestUrl',
        'success',
        'charset',
      );
      expect(response).to.have.property('ok', true);
    });
  });
});
