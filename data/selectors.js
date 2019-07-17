import { denormalize } from 'normalizr';
import get from 'lodash/get';

import { albumSchema } from '../store';

export function getRequestData(state, requestId) {
  return get(state, ['data', requestId]);
}

export function getRequestStatus(state, requestId) {
  return get(state, ['requests', requestId]);
}

export function getAlbums(state, idsKey = 'albumsIds') {
  const albums = getRequestData(state, idsKey);
  const albumEntities = getRequestData(state, 'albumsById');
  const denormalizedData = denormalize(
    { albums },
    { albums: [albumSchema] },
    { albums: albumEntities }
  );
  return get(denormalizedData, 'albums');
}

export function getTopListenedAlbums(state) {
    return getAlbums(state, 'topListenedIds');
}

export function getAlbumById(state, albumId) {
  const albumsById = getRequestData(state, 'albumsById');
  return get(albumsById, albumId);
}

export function getAlbumSongs(state, albumId) {
  return get(getRequestData(state, 'songsPerAlbum'), albumId, []);
}

export function createGetAlbumSongs(state) {
  return getAlbumSongs.bind(null, state);
}
