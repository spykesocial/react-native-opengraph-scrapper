# React Native OpenGraph Scrapper

A TypeScript-friendly React Native package for scraping Open Graph metadata and Twitter Card information from a URL or HTML string.

## Installation


```bash
yarn add @spykesocial/react-native-opengraph-scrapper
```
or
```bash
npm install @spykesocial/react-native-opengraph-scrapper
```



## Usage

Use a normal React Native or TypeScript import:

```ts
import getOpenGraphData from '@spykesocial/react-native-opengraph-scrapper';

const { error, result, response } = await getOpenGraphData({
  url: 'https://ogp.me/',
});

console.log(error);
console.log(result);
console.log(response);
```

Named import is also supported:

```ts
import { run } from '@spykesocial/react-native-opengraph-scrapper';
```

Callback usage is still supported for existing callers:

```ts
import getOpenGraphData from '@spykesocial/react-native-opengraph-scrapper';

getOpenGraphData({ url: 'https://ogp.me/' }, (error, result, response) => {
  console.log('error:', error);
  console.log('result:', result);
  console.log('response:', response);
});
```

## React Native Notes

The package uses the runtime `fetch`, `AbortController`, `setTimeout`, and `TextDecoder` APIs instead of Node HTTP modules. Modern React Native versions provide `fetch`; if your app targets an older runtime, add the missing polyfills in your app entry file.

The package publishes ESM, CommonJS, and TypeScript declarations:

```ts
import getOpenGraphData from '@spykesocial/react-native-opengraph-scrapper';
```

CommonJS consumers can still use:

```js
const getOpenGraphData = require('@spykesocial/react-native-opengraph-scrapper');
```

## Result Shape

Successful promise calls resolve with:

```ts
{
  error: false,
  result: {
    ogTitle: 'Open Graph protocol',
    ogType: 'website',
    ogUrl: 'https://ogp.me/',
    ogDescription: 'The Open Graph protocol enables any web page to become a rich object in a social graph.',
    ogImage: {
      url: 'https://ogp.me/logo.png',
      width: '300',
      height: '300',
      type: 'image/png',
    },
    requestUrl: 'https://ogp.me/',
    success: true,
  },
  response,
}
```

Failed promise calls reject with:

```ts
{
  error: true,
  result: {
    success: false,
    requestUrl: 'https://example.com',
    error: 'Page not found',
    errorDetails: Error,
  },
}
```

## Options

| Name | Info | Default Value | Required |
| --- | --- | --- | --- |
| `url` | URL of the site to scrape. Use either `url` or `html`, not both. | | Yes, unless `html` is set |
| `html` | HTML string to parse without making a network request. | | Yes, unless `url` is set |
| `timeout` | Request timeout in milliseconds. | `2000` | |
| `blacklist` | Hostnames or URL fragments that should not be scraped. | `[]` | |
| `onlyGetOpenGraphInfo` | Only read Open Graph tags and skip fallback parsing. | `false` | |
| `ogImageFallback` | Use page images when no Open Graph image exists. | `true` | |
| `customMetaTags` | Additional meta tags to scrape. | `[]` | |
| `allMedia` | Return every image/video/player instead of only the first. | `false` | |
| `retry` | Reserved for compatibility with older options. | `2` | |
| `headers` | Request headers, such as a custom user agent. | `{}` | |
| `peekSize` | Number of bytes/chars used when detecting charset. | `1024` | |
| `urlValidatorSettings` | Options passed to `validator.isURL`. | Default URL validation settings | |

[Thanks](https://github.com/chrisuehlinger/openGraphScraperLite)
