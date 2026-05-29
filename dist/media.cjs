var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var media_exports = {};
__export(media_exports, {
  mediaSetup: () => mediaSetup
});
module.exports = __toCommonJS(media_exports);
var import_fields = __toESM(require("./fields.js"), 1);
const mediaMapperTwitterImage = (item) => ({
  url: item[0],
  width: item[1],
  height: item[2],
  alt: item[3]
});
const mediaMapperTwitterPlayer = (item) => ({
  url: item[0],
  width: item[1],
  height: item[2],
  stream: item[3]
});
const mediaMapperMusicSong = (item) => ({
  url: item[0],
  track: item[1],
  disc: item[2]
});
const mediaMapper = (item) => ({
  url: item[0],
  width: item[1],
  height: item[2],
  type: item[3]
});
const mediaSorter = (a, b) => {
  if (!(a.url && b.url)) {
    return 0;
  }
  const aRes = a.url.match(/\.(\w{2,5})$/);
  const aExt = aRes && aRes[1].toLowerCase() || null;
  const bRes = b.url.match(/\.(\w{2,5})$/);
  const bExt = bRes && bRes[1].toLowerCase() || null;
  if (aExt === "gif" && bExt !== "gif") {
    return -1;
  }
  if (aExt !== "gif" && bExt === "gif") {
    return 1;
  }
  return Math.max(Number(b.width), Number(b.height)) - Math.max(Number(a.width), Number(a.height));
};
const mediaSorterMusicSong = (a, b) => {
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
const toArray = (value) => Array.isArray(value) ? value : void 0;
const zip = (array, ...args) => {
  if (array === void 0) return [];
  return array.map((value, idx) => [value, ...args.map((arr) => arr?.[idx])]);
};
const mediaSetup = (ogObject, options) => {
  const meta = ogObject;
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
    toArray(meta.ogImageType)
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
    toArray(meta.ogVideoType)
  ).map(mediaMapper).sort(mediaSorter);
  if (meta.twitterImageSrc || meta.twitterImage || meta.twitterImageWidth || meta.twitterImageHeight || meta.twitterImageAlt) {
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
    toArray(meta.twitterImageAlt)
  ).map(mediaMapperTwitterImage).sort(mediaSorter);
  if (meta.twitterPlayer || meta.twitterPlayerWidth || meta.twitterPlayerHeight || meta.twitterPlayerStream) {
    meta.twitterPlayer = meta.twitterPlayer ? meta.twitterPlayer : [null];
    meta.twitterPlayerWidth = meta.twitterPlayerWidth ? meta.twitterPlayerWidth : [null];
    meta.twitterPlayerHeight = meta.twitterPlayerHeight ? meta.twitterPlayerHeight : [null];
    meta.twitterPlayerStream = meta.twitterPlayerStream ? meta.twitterPlayerStream : [null];
  }
  const twitterPlayers = zip(
    toArray(meta.twitterPlayer),
    toArray(meta.twitterPlayerWidth),
    toArray(meta.twitterPlayerHeight),
    toArray(meta.twitterPlayerStream)
  ).map(mediaMapperTwitterPlayer).sort(mediaSorter);
  if (meta.musicSong || meta.musicSongTrack || meta.musicSongDisc) {
    meta.musicSong = meta.musicSong ? meta.musicSong : [null];
    meta.musicSongTrack = meta.musicSongTrack ? meta.musicSongTrack : [null];
    meta.musicSongDisc = meta.musicSongDisc ? meta.musicSongDisc : [null];
  }
  const musicSongs = zip(
    toArray(meta.musicSong),
    toArray(meta.musicSongTrack),
    toArray(meta.musicSongDisc)
  ).map(mediaMapperMusicSong).sort(mediaSorterMusicSong);
  import_fields.default.filter((item) => item.multiple && item.fieldName && item.fieldName.match("(ogImage|ogVideo|twitter|musicSong).*")).forEach((item) => {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mediaSetup
});
//# sourceMappingURL=media.cjs.map