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
  const meta: Record<string, unknown> = ogObject;

  if (meta.ogImage || meta.ogImageWidth || meta.twitterImageHeight || meta.ogImageType) {
    meta.ogImage = meta.ogImage ? meta.ogImage : [null];
    meta.ogImageWidth = meta.ogImageWidth ? meta.ogImageWidth : [null];
    meta.ogImageHeight = meta.ogImageHeight ? meta.ogImageHeight : [null];
    meta.ogImageType = meta.ogImageType ? meta.ogImageType : [null];
  }

  const ogImages = zip(
    toArray(meta.ogImage),
    toArray(meta.ogImageWidth),
    toArray(meta.ogImageHeight),
    toArray(meta.ogImageType),
  ).map(mediaMapper).sort(mediaSorter);

  if (meta.ogVideo || meta.ogVideoWidth || meta.ogVideoHeight || meta.ogVideoType) {
    meta.ogVideo = meta.ogVideo ? meta.ogVideo : [null];
    meta.ogVideoWidth = meta.ogVideoWidth ? meta.ogVideoWidth : [null];
    meta.ogVideoHeight = meta.ogVideoHeight ? meta.ogVideoHeight : [null];
    meta.ogVideoType = meta.ogVideoType ? meta.ogVideoType : [null];
  }

  const ogVideos = zip(
    toArray(meta.ogVideo),
    toArray(meta.ogVideoWidth),
    toArray(meta.ogVideoHeight),
    toArray(meta.ogVideoType),
  ).map(mediaMapper).sort(mediaSorter);

  if (
    meta.twitterImageSrc
    || meta.twitterImage
    || meta.twitterImageWidth
    || meta.twitterImageHeight
    || meta.twitterImageAlt
  ) {
    meta.twitterImageSrc = meta.twitterImageSrc ? meta.twitterImageSrc : [null];
    meta.twitterImage = meta.twitterImage ? meta.twitterImage : meta.twitterImageSrc;
    meta.twitterImageWidth = meta.twitterImageWidth ? meta.twitterImageWidth : [null];
    meta.twitterImageHeight = meta.twitterImageHeight ? meta.twitterImageHeight : [null];
    meta.twitterImageAlt = meta.twitterImageAlt ? meta.twitterImageAlt : [null];
  }

  const twitterImages = zip(
    toArray(meta.twitterImage),
    toArray(meta.twitterImageWidth),
    toArray(meta.twitterImageHeight),
    toArray(meta.twitterImageAlt),
  ).map(mediaMapperTwitterImage).sort(mediaSorter);

  if (
    meta.twitterPlayer
    || meta.twitterPlayerWidth
    || meta.twitterPlayerHeight
    || meta.twitterPlayerStream
  ) {
    meta.twitterPlayer = meta.twitterPlayer ? meta.twitterPlayer : [null];
    meta.twitterPlayerWidth = meta.twitterPlayerWidth ? meta.twitterPlayerWidth : [null];
    meta.twitterPlayerHeight = meta.twitterPlayerHeight ? meta.twitterPlayerHeight : [null];
    meta.twitterPlayerStream = meta.twitterPlayerStream ? meta.twitterPlayerStream : [null];
  }

  const twitterPlayers = zip(
    toArray(meta.twitterPlayer),
    toArray(meta.twitterPlayerWidth),
    toArray(meta.twitterPlayerHeight),
    toArray(meta.twitterPlayerStream),
  ).map(mediaMapperTwitterPlayer).sort(mediaSorter);

  if (meta.musicSong || meta.musicSongTrack || meta.musicSongDisc) {
    meta.musicSong = meta.musicSong ? meta.musicSong : [null];
    meta.musicSongTrack = meta.musicSongTrack ? meta.musicSongTrack : [null];
    meta.musicSongDisc = meta.musicSongDisc ? meta.musicSongDisc : [null];
  }

  const musicSongs = zip(
    toArray(meta.musicSong),
    toArray(meta.musicSongTrack),
    toArray(meta.musicSongDisc),
  ).map(mediaMapperMusicSong).sort(mediaSorterMusicSong);

  fields.filter((item) => (item.multiple && item.fieldName && item.fieldName.match('(ogImage|ogVideo|twitter|musicSong).*')))
    .forEach((item) => {
      delete meta[item.fieldName];
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
