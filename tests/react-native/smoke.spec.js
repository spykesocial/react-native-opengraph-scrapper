const { createMockFetchResponse } = require('../helpers/mockFetch');

require('whatwg-fetch');

const ogs = require('../../index');

describe('React Native compatibility', function () {
  it('loads the package without Node-only APIs', function () {
    expect(ogs).to.be.a('function');
  });

  it('scrapes ogp.me using the same fetch API React Native provides', function () {
    return ogs({ url: 'https://ogp.me/' })
      .then(({ error, result, response }) => {
        expect(error).to.be.eql(false);
        expect(result.success).to.be.eql(true);
        expect(result.ogTitle).to.be.eql('Open Graph protocol');
        expect(result.ogUrl).to.be.eql('https://ogp.me/');
        expect(response).to.be.an('object');
        expect(typeof response.text).to.be.eql('function');
      });
  });

  it('scrapes HTML passed directly without a network request', function () {
    const html = `
      <html>
        <head>
          <meta property="og:title" content="RN test title">
        </head>
      </html>`;

    return ogs({ html })
      .then(({ error, result }) => {
        expect(error).to.be.eql(false);
        expect(result.success).to.be.eql(true);
        expect(result.ogTitle).to.be.eql('RN test title');
      });
  });

  it('uses a mocked fetch response like React Native would', function () {
    const html = `
      <html>
        <head>
          <meta property="og:title" content="mocked title">
        </head>
      </html>`;
    const fetchStub = sinon.stub(global, 'fetch').resolves(createMockFetchResponse(html));

    return ogs({ url: 'https://example.com' })
      .then(({ error, result }) => {
        expect(fetchStub.calledOnce).to.be.eql(true);
        expect(error).to.be.eql(false);
        expect(result.ogTitle).to.be.eql('mocked title');
      })
      .finally(() => {
        fetchStub.restore();
      });
  });
});
