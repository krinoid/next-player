import createJsonEndpoint from '../../../lib/json-endpoint';
import datasetteProxy from '../../../lib/datasette-proxy';

// this endpoint performs kind of a distributed join operation
// we get album data from 1st endpoint and album's songs from the 2nd
// both requests are fetched in parallel as the fail-fast behaviour
// of Promise.all aligns with our approach: if either album or song data
// is not available -- we return an error
async function handler(req) {
  const {
    query: { albumId },
  } = req;

  const albumDataPromise = datasetteProxy({
    tableName: 'albums',
    params: { album_id__exact: albumId },
  });

  const albumSongsPromise = datasetteProxy({
    tableName: 'tracks',
    params: { album_id__exact: albumId, _sort: 'track_number' },
  });

  const [albumData, albumSongs] = await Promise.all([albumDataPromise, albumSongsPromise]);

  if (!albumData || !albumSongs || albumData.length === 0 || !albumData[0]) {
    const notFoundError = new Error('Album not found');
    notFoundError.statusCode = 404;
    throw notFoundError;
  }

  const S3_BUCKET_URL = process.env.S3_BUCKET_URL;
  const FALLBACK_TRACK_ID = process.env.FALLBACK_TRACK_ID;

  const songsWithUrl = albumSongs.map(song => {
    // we've used medium dataset, which includes only part of the songs
    const hasAudio = song.set_subset === 'small' || song.set_subset === 'medium';
    // if this song is not in the "small" dataset, we'll use fallback
    const filename = `${hasAudio ? song.track_id : FALLBACK_TRACK_ID}`.padStart(6, '0');
    const songDirectory = filename.substring(0, 3);

    return {
      ...song,
      has_audio: hasAudio,
      url: `${S3_BUCKET_URL}/${songDirectory}/${filename}.mp3?_id=${song.track_id}`,
    };
  });

  return {
    ...albumData[0],
    songs: songsWithUrl,
  };
}

export default createJsonEndpoint(handler);
