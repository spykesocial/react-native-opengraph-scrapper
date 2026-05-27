/* eslint-disable no-console */
import getOpenGraphData from '@spykesocial/react-native-opengraph-scrapper';

const options = {
  url: 'https://ogp.me/',
};

getOpenGraphData(options)
  .then((data) => {
    const { error, result, response } = data;
    console.log('error:', error);
    console.log('result:', result);
    console.log('response:', response);
  });
