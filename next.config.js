const withCSS = require('@zeit/next-css');
module.exports = withCSS({
  env: {
    API_BASE: process.env.API_BASE,
    MUSIC_DATA_API: process.env.MUSIC_DATA_API,
    S3_BUCKET_URL: process.env.S3_BUCKET_URL,
    FALLBACK_TRACK_ID: process.env.FALLBACK_TRACK_ID,
  },
});
