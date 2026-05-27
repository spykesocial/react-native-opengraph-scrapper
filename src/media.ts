import fields from './fields.js';
import type { MediaResult, OpenGraphResult, OpenGraphScraperOptions } from './types.js';

const mediaMapperTwitterImage = (item: Array<string | null | undefined>): MediaResult => ({
  url: item[0],
  width: item[1],
  height: item[2],
  alt: item[3],
});

const mediaMapperTwitterPlayer = (item: Array<string | null | undefined>): MediaResult => ({
  url: item[0],
  width: item[1],
  height: item[2],
  stream: item[3],
});

const mediaMapperMusicSong = (item: Array<string | null | undefined>): MediaResult => ({
  url: item[0],
  track: item[1],
  disc: item[2],
});

const mediaMapper = (item: Array<string | null | undefined>): MediaResult => ({
  url: item[0],
  width: item[1],
  height: item[2],
  type: item[3],
});

const mediaSorter = (a: MediaResult, b: MediaResult) => {
  if (!(a.url && b.url)) {
    return 0;
  }

  const aRes = a.url.match(/\.(\w{2,5})$/);
  const aExt = (aRes && aRes[1].toLowerCase()) || null;
  const bRes = b.url.match(/\.(\w{2,5})$/);
  const bExt = (bRes && bRes[1].toLowerCase()) || null;

  if (aExt === 'gif' && bExt !== 'gif') {
    return -1;
  }
  if (aExt !== 'gif' && bExt === 'gif') {
    return 1;
  }
  return Math.max(Number(b.width), Number(b.height)) - Math.max(Number(a.width), Number(a.height));
};

const mediaSorterMusicSong = (a: MediaResult, b: MediaResult) => {
  if (!(a.track && b.track)) {
    return 0;
  }
  if (Number(a.disc) > Number(b.disc)) {
    return 1;
  }
  if (Number(a.disc) < Number(b.disc)) {
    return -1;
  }
  return Number(a.track) - Number(b.track);
};

const toArray = (value: unknown): Array<string | null | undefined> | undefined => (
  Array.isArray(value) ? value as Array<string | null | undefined> : undefined
);

const zip = (
  array: Array<string | null | undefined> | undefined,
  ...args: Array<Array<string | null | undefined> | undefined>
) => {
  if (array === undefined) return [];
  return array.map((value, idx) => [value, ...args.map((arr) => arr?.[idx])]);
};

export const mediaSetup = (ogObject: OpenGraphResult, options: OpenGraphScraperOptions) => {
  if (ogObject.ogImage || ogObject.ogImageWidth || ogObject.twitterImageHeight || ogObject.ogImageType) {
    ogObject.ogImage = ogObject.ogImage ? ogObject.ogImage : [null];
    ogObject.ogImageWidth = ogObject.ogImageWidth ? ogObject.ogImageWidth : [null];
    ogObject.ogImageHeight = ogObject.ogImageHeight ? ogObject.ogImageHeight : [null];
    ogObject.ogImageType = ogObject.ogImageType ? ogObject.ogImageType : [null];
  }

  const ogImages = zip(
    toArray(ogObject.ogImage),
    toArray(ogObject.ogImageWidth),
    toArray(ogObject.ogImageHeight),
    toArray(ogObject.ogImageType),
  ).map(mediaMapper).sort(mediaSorter);

  if (ogObject.ogVideo || ogObject.ogVideoWidth || ogObject.ogVideoHeight || ogObject.ogVideoType) {
    ogObject.ogVideo = ogObject.ogVideo ? ogObject.ogVideo : [null];
    ogObject.ogVideoWidth = ogObject.ogVideoWidth ? ogObject.ogVideoWidth : [null];
    ogObject.ogVideoHeight = ogObject.ogVideoHeight ? ogObject.ogVideoHeight : [null];
    ogObject.ogVideoType = ogObject.ogVideoType ? ogObject.ogVideoType : [null];
  }

  const ogVideos = zip(
    toArray(ogObject.ogVideo),
    toArray(ogObject.ogVideoWidth),
    toArray(ogObject.ogVideoHeight),
    toArray(ogObject.ogVideoType),
  ).map(mediaMapper).sort(mediaSorter);

  if (
    ogObject.twitterImageSrc
    || ogObject.twitterImage
    || ogObject.twitterImageWidth
    || ogObject.twitterImageHeight
    || ogObject.twitterImageAlt
  ) {
    ogObject.twitterImageSrc = ogObject.twitterImageSrc ? ogObject.twitterImageSrc : [null];
    ogObject.twitterImage = ogObject.twitterImage ? ogObject.twitterImage : ogObject.twitterImageSrc;
    ogObject.twitterImageWidth = ogObject.twitterImageWidth ? ogObject.twitterImageWidth : [null];
    ogObject.twitterImageHeight = ogObject.twitterImageHeight ? ogObject.twitterImageHeight : [null];
    ogObject.twitterImageAlt = ogObject.twitterImageAlt ? ogObject.twitterImageAlt : [null];
  }

  const twitterImages = zip(
    toArray(ogObject.twitterImage),
    toArray(ogObject.twitterImageWidth),
    toArray(ogObject.twitterImageHeight),
    toArray(ogObject.twitterImageAlt),
  ).map(mediaMapperTwitterImage).sort(mediaSorter);

  if (
    ogObject.twitterPlayer
    || ogObject.twitterPlayerWidth
    || ogObject.twitterPlayerHeight
    || ogObject.twitterPlayerStream
  ) {
    ogObject.twitterPlayer = ogObject.twitterPlayer ? ogObject.twitterPlayer : [null];
    ogObject.twitterPlayerWidth = ogObject.twitterPlayerWidth ? ogObject.twitterPlayerWidth : [null];
    ogObject.twitterPlayerHeight = ogObject.twitterPlayerHeight ? ogObject.twitterPlayerHeight : [null];
    ogObject.twitterPlayerStream = ogObject.twitterPlayerStream ? ogObject.twitterPlayerStream : [null];
  }

  const twitterPlayers = zip(
    toArray(ogObject.twitterPlayer),
    toArray(ogObject.twitterPlayerWidth),
    toArray(ogObject.twitterPlayerHeight),
    toArray(ogObject.twitterPlayerStream),
  ).map(mediaMapperTwitterPlayer).sort(mediaSorter);

  if (ogObject.musicSong || ogObject.musicSongTrack || ogObject.musicSongDisc) {
    ogObject.musicSong = ogObject.musicSong ? ogObject.musicSong : [null];
    ogObject.musicSongTrack = ogObject.musicSongTrack ? ogObject.musicSongTrack : [null];
    ogObject.musicSongDisc = ogObject.musicSongDisc ? ogObject.musicSongDisc : [null];
  }

  const musicSongs = zip(
    toArray(ogObject.musicSong),
    toArray(ogObject.musicSongTrack),
    toArray(ogObject.musicSongDisc),
  ).map(mediaMapperMusicSong).sort(mediaSorterMusicSong);

  fields.filter((item) => (item.multiple && item.fieldName && item.fieldName.match('(ogImage|ogVideo|twitter|musicSong).*')))
    .forEach((item) => {
      delete ogObject[item.fieldName];
    });

  if (options.allMedia) {
    if (ogImages.length) ogObject.ogImage = ogImages;
    if (ogVideos.length) ogObject.ogVideo = ogVideos;
    if (twitterImages.length) ogObject.twitterImage = twitterImages;
    if (twitterPlayers.length) ogObject.twitterPlayer = twitterPlayers;
    if (musicSongs.length) ogObject.musicSong = musicSongs;
  } else {
    if (ogImages.length) [ogObject.ogImage] = ogImages;
    if (ogVideos.length) [ogObject.ogVideo] = ogVideos;
    if (twitterImages.length) [ogObject.twitterImage] = twitterImages;
    if (twitterPlayers.length) [ogObject.twitterPlayer] = twitterPlayers;
    if (musicSongs.length) [ogObject.musicSong] = musicSongs;
  }

  return ogObject;
};
