import ogs from '@spykesocial/react-native-opengraph-scrapper';

describe('onlyGetOpenGraphInfo', function () {
  it('should only get open graph info', function () {
    return ogs({
      url: 'http://www.wikipedia.org/',
      onlyGetOpenGraphInfo: true,
    }, function (error, result, response) {
      console.log('error:', error);
      console.log('result:', result);
      expect(error).to.be.eql(false);
      expect(result.ogTitle).to.eql('Wikipedia, the free encyclopedia');
      expect(result.ogDescription).to.be.a('string').and.to.not.be.empty;
      expect(result.requestUrl).to.be.eql('http://www.wikipedia.org/');
      expect(result.success).to.be.eql(true);
      expect(result).to.not.have.property('charset');
      expect(response).to.have.property('ok', true);
    });
  });
  it('should get all open graph info', function () {
    return ogs({
      url: 'http://www.wikipedia.org/',
      onlyGetOpenGraphInfo: false,
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
