/* eslint-disable mocha/no-setup-in-describe */
const utils = require('../../lib/utils');

const validateUrl = (urls, valid, message, urlValidatorSettings) => {
  for (let index = 0; index < urls.length; index += 1) {
    // eslint-disable-next-line no-loop-func
    it(`${urls[index]} ${message}`, function () {
      const validate = utils.validate(urls[index], 2000, urlValidatorSettings);
      if (valid) {
        return expect(validate.url).to.not.be.eql(null);
      }
      return expect(validate.url).to.be.eql(null);
    });
  }
};

describe('utils', function () {
  describe('validate', function () {
    context('validing URLs', function () {
      const defaultUrlValidatorSettings = {
        protocols: ['http', 'https'],
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
      };

      validateUrl([
        'foobar.com',
        'foobar.com/',
        'http://[::192.9.5.5]/ipng',
        'http://[::FFFF:129.144.52.38]:80/index.html',
        'http://[1080::8:800:200C:417A]/foo',
        'http://[1080:0:0:0:8:800:200C:417A]/index.html',
        'http://[2010:836B:4179::836B:4179]',
        'http://[3ffe:2a00:100:7031::1]',
        'http://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:80/index.html',
        'http://10.0.0.0/',
        'http://127.0.0.1/',
        'http://189.123.14.13/',
        'http://duckduckgo.com/?q=%2F',
        'http://example.com/example.json#/foo/bar',
        'http://foo--bar.com',
        'http://foobar.com?foo=bar',
        'http://foobar.com/?foo=bar#baz=qux',
        'http://foobar.com/t$-_.+!*\'(),',
        'http://foobar.com#baz=qux',
        'http://høyfjellet.no',
        'http://user:@www.foobar.com/',
        'http://user:pass@www.foobar.com/',
        'http://www.foobar.com:23/',
        'http://www.foobar.com:5/',
        'http://www.foobar.com:65535/',
        'http://www.foobar.com/',
        'HTTP://WWW.FOOBAR.COM/',
        'http://www.foobar.com/~foobar',
        'http://www.xn--froschgrn-x9a.net/',
        'http://xn------eddceddeftq7bvv7c4ke4c.xn--p1ai',
        'http://xn--froschgrn-x9a.com/',
        'http://xn--j1aac5a4g.xn--j1amh',
        'http://кулік.укр',
        'https://www.foobar.com/',
        'https://www.foobar.com/',
        'HTTPS://WWW.FOOBAR.COM/',
        'test.com?ref=http://test2.com',
        'valid.au',
        'www.foobar.com',
      ], true, 'should be valid', defaultUrlValidatorSettings);

      validateUrl([
        '!.foo.com',
        '.com',
        '',
        '*.foo.com',
        '////foobar.com',
        '//foobar.com',
        'ftp://www.foobar.com/',
        'http://*.foo.com',
        'http:////foobar.com',
        'http://\n@www.foobar.com/',
        'http://300.0.0.1/',
        'http://com/',
        'http://example.com.',
        'http://foobar/ lol/',
        'http://foobar/? lol',
        'http://foobar/# lol',
        'http://localhost:3000/',
        'http://localhost:61500this is an invalid url!!!!',
        'http://lol @foobar.com/',
        'http://lol: @foobar.com/',
        'http://lol:lol @foobar.com/',
        'http://lol:lol:lol@foobar.com/',
        'http://www.-foobar.com/',
        'http://www.foo_bar.com/',
        'http://www.foobar-.com/',
        'http://www.foobar.com:0/',
        'http://www.foobar.com:70000/',
        'http://www.foobar.com:99999/',
        'http://www.foobar.com/\t',
        'http://www.xn--.com/',
        'http://xn--.com/',
        'https://example.com/foo/<script>alert(\'XSS\')</script>/',
        'invalid.',
        'invalid.x',
        'invalid/',
        'mailto:foo@bar.com',
        'rtmp://foobar.com',
        'xyz://foobar.com',
        `http://foobar.com/${new Array(2083).join('f')}`,
      ], false, 'should be invalid', defaultUrlValidatorSettings);
    });

    context('validing URLs with options.urlValidatorSettings (https is invalid)', function () {
      const noHTTPSUrlValidatorSettings = {
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
      };

      validateUrl([
        'http://www.foobar.com/',
        'http://www.foobar.com/',
        'HTTP://WWW.FOOBAR.COM/',
      ], true, 'should be valid', noHTTPSUrlValidatorSettings);

      validateUrl([
        'https://www.foobar.com/',
        'https://www.foobar.com/',
        'HTTPS://WWW.FOOBAR.COM/',
      ], false, 'should be invalid', noHTTPSUrlValidatorSettings);
    });

    context('validing Timeouts', function () {
      it('time out is 2000', function () {
        const validate = utils.validate('foobar.com', 2000);
        expect(validate.timeout).to.eql(2000);
      });
      it('timeout is under 2000', function () {
        const validate = utils.validate('foobar.com', 1000);
        expect(validate.timeout).to.eql(1000);
      });
      it('timeout is above 2000', function () {
        const validate = utils.validate('foobar.com', 3000);
        expect(validate.timeout).to.eql(3000);
      });
      it('timeout is a string', function () {
        const validate = utils.validate('foobar.com', '123');
        expect(validate.timeout).to.eql(2000);
      });
      it('timeout is a bool', function () {
        const validate = utils.validate('foobar.com', true);
        expect(validate.timeout).to.eql(2000);
      });
      it('timeout is empty string', function () {
        const validate = utils.validate('foobar.com', '');
        expect(validate.timeout).to.eql(2000);
      });
      it('timeout is missing', function () {
        const validate = utils.validate('foobar.com');
        expect(validate.timeout).to.eql(2000);
      });
    });
  });

  describe('findImageTypeFromUrl', function () {
    it('foobar.com/image.png?test=true', function () {
      const type = utils.findImageTypeFromUrl('foobar.com/image.png?test=true');
      expect(type).to.eql('png');
    });
    it('foobar.com/image.png', function () {
      const type = utils.findImageTypeFromUrl('foobar.com/image.png');
      expect(type).to.eql('png');
    });
    it('image.png', function () {
      const type = utils.findImageTypeFromUrl('image.png');
      expect(type).to.eql('png');
    });
    it('image', function () {
      const type = utils.findImageTypeFromUrl('image');
      expect(type).to.eql('image');
    });
  });

  describe('isImageTypeValid', function () {
    it('when type is png', function () {
      const valid = utils.isImageTypeValid('png');
      expect(valid).to.eql(true);
    });
    it('when type is foo', function () {
      const valid = utils.isImageTypeValid('foo');
      expect(valid).to.eql(false);
    });
  });

  describe('isThisANonHTMLUrl', function () {
    it('when url is type .png', function () {
      const valid = utils.isThisANonHTMLUrl('www.foo.com/bar.png');
      expect(valid).to.eql(true);
    });
    it('when url is type .html', function () {
      const valid = utils.isThisANonHTMLUrl('www.foo.com/bar.html');
      expect(valid).to.eql(false);
    });
    it('when url is type .pdf and has params', function () {
      const valid = utils.isThisANonHTMLUrl('www.foo.com/bar.pdf?123');
      expect(valid).to.eql(true);
    });
    it('when domain in url contains a non HTML string (.txt)', function () {
      const valid = utils.isThisANonHTMLUrl('www.txt.com/bar.html');
      expect(valid).to.eql(false);
    });
    it('when domain in url contains a non HTML string (.mov) no extension on path', function () {
      const valid = utils.isThisANonHTMLUrl('www.mov.com/bar');
      expect(valid).to.eql(false);
    });
  });

  describe('removeNestedUndefinedValues', function () {
    it('when there is no undef values', function () {
      const object = utils.removeNestedUndefinedValues({ one: 1 });
      expect(object).to.eql({ one: 1 });
    });
    it('when there is undef values', function () {
      const object = utils.removeNestedUndefinedValues({ one: 1, two: undefined });
      expect(object).to.eql({ one: 1 });
    });
    it('when there is a nested undef value', function () {
      const object = utils.removeNestedUndefinedValues({ one: 1, two: { three: undefined } });
      expect(object).to.eql({ one: 1, two: {} });
    });
  });
});
