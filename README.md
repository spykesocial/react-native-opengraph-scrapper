# React-Native-OpenGraph-Scrapper

A simple javascript module for scraping OpenGraph metadata and Twitter Card info off a site.  

## Installation

```bash
  yarn add @spykesocial/react-native-opengraph-scrapper
```

## Usage

Callback Example:
```javascript
const getOpenGraphData = require('@spykesocial/react-native-opengraph-scrapper');
const options = { url: 'http://ogp.me/' };
getOpenGraphData(options, (error, results, response) => {
    console.log('error:', error); // This is returns true or false. True if there was a error. The error it self is inside the results object.
    console.log('results:', results); // This contains all of the Open Graph results
    console.log('response:', response); // This contains the HTML of page
  });
```

Promise Example:
```javascript
const getOpenGraphData = require('@spykesocial/react-native-opengraph-scrapper');
const options = { url: 'http://ogp.me/' };
getOpenGraphData(options)
  .then((data) => {
    const { error, result, response } = data;
    console.log('error:', error);  // This is returns true or false. True if there was a error. The error it self is inside the results object.
    console.log('result:', result); // This contains all of the Open Graph results
    console.log('response:', response); // This contains the HTML of page
  })
```

## Results JSON

Check the return for a ```success``` flag. If success is set to true, then the url input was valid. Otherwise it will be set to false. The above example will return something like...
```javascript
{
  ogTitle: 'Open Graph protocol',
  ogType: 'website',
  ogUrl: 'http://ogp.me/',
  ogDescription: 'The Open Graph protocol enables any web page to become a rich object in a social graph.',
  ogImage: {
    url: 'http://ogp.me/logo.png',
    width: '300',
    height: '300',
    type: 'image/png'
  },
  requestUrl: 'http://ogp.me/',
  success: true
}
```

## Options
| Name                 | Info                                                                       | Default Value | Required |
|----------------------|----------------------------------------------------------------------------|---------------|----------|
| url                  | URL of the site.                                                           |               | x        |
| timeout              | Timeout of the request                                                     | 2000 ms       |          |
| html                 | You can pass in an HTML string to run ogs on it. (use without options.url) |               |          |
| blacklist            | Pass in an array of sites you don't want ogs to run on.                    | []            |          |
| onlyGetOpenGraphInfo | Only fetch open graph info and don't fall back on anything else.           | false         |          |
| ogImageFallback      | Fetch other images if no open graph ones are found.                        | true          |          |
| customMetaTags       | Here you can define custom meta tags you want to scrape.                   | []            |          |
| allMedia             | By default, OGS will only send back the first image/video it finds         | false         |          |
| retry                | Number of times ogs will retry the request.                                | 2             |          |
| headers              | An object containing request headers. Useful for setting the user-agent    | {}            |          |
| peekSize             | Sets the peekSize for the request                                          | 1024          |          |
| urlValidatorSettings | Sets the options used by validator.js for testing the URL                  | [Here](https://github.com/jshemas/openGraphScraper/blob/master/lib/openGraphScraper.js#L21-L36)          |          |




//thanks https://github.com/chrisuehlinger/openGraphScraperLite
