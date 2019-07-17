import { createStore, applyMiddleware } from 'redux';
import produce from 'immer';
import { normalize, schema } from 'normalizr';
import get from 'lodash/get';
import { apiMiddleware, RSAA, getJSON } from 'redux-api-middleware';
import { composeWithDevTools } from 'redux-devtools-extension';

export const albumSchema = new schema.Entity('albums', {}, { idAttribute: 'album_id' });

const initialState = {
  requests: {},
  data: {
    albumsIds: [],
    topListenedIds: [],
    albumsById: {},
    songsPerAlbum: {},
  },
};

// helper for redux-api-middleware when processing success actions
// so we don't have to extract "data" property from API response every time
const processApiSuccessResponse = (action, state, res) =>
  getJSON(res).then(json => get(json, 'data'));

const requestStatusTypes = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};

const updateRequestStatus = (state = {}, action = {}, requestId = '') => {
  // automatically determine request status (LOADING/SUCCESS/ERROR) from action type
  let requestStatus;
  if (action.type.includes(requestStatusTypes.SUCCESS)) requestStatus = requestStatusTypes.SUCCESS;
  else if (action.type.includes(requestStatusTypes.ERROR)) requestStatus = requestStatusTypes.ERROR;
  else requestStatus = requestStatusTypes.LOADING;

  return produce(state, draftState => {
    draftState.requests[requestId] = requestStatus;
  });
};

export const reducer = (state = initialState, action) => {
  let baseState;
  switch (action.type) {
    case 'FETCH_ALBUMS':
    case 'FETCH_ALBUMS_ERROR':
      return updateRequestStatus(state, action, 'albums');
    case 'FETCH_ALBUMS_SUCCESS':
      baseState = updateRequestStatus(state, action, 'albums');
      return produce(baseState, draftState => {
        const albumsNormalized = normalize(action.payload, [albumSchema]);
        draftState.data.albumsById = {
            ...draftState.data.albumsById,
            ...get(albumsNormalized, ['entities', 'albums']),
          };
        draftState.data.albumsIds = get(albumsNormalized, 'result');
      });
    case 'FETCH_TOP_LISTENED_ALBUMS':
    case 'FETCH_TOP_LISTENED_ALBUMS_ERROR':
      return updateRequestStatus(state, action, 'topListenedAlbums');
    case 'FETCH_TOP_LISTENED_ALBUMS_SUCCESS':
      baseState = updateRequestStatus(state, action, 'topListenedAlbums');
      return produce(baseState, draftState => {
        const albumsNormalized = normalize(action.payload, [albumSchema]);
        draftState.data.albumsById = {
          ...draftState.data.albumsById,
          ...get(albumsNormalized, ['entities', 'albums']),
        };
        draftState.data.topListenedIds = get(albumsNormalized, 'result');
      });

    case 'FETCH_SINGLE_ALBUM':
    case 'FETCH_SINGLE_ALBUM_ERROR':
      return updateRequestStatus(state, action, 'songsPerAlbum');
    case 'FETCH_SINGLE_ALBUM_SUCCESS':
      const albumId = get(action, ['payload', 'album_id']);
      baseState = updateRequestStatus(state, action, 'songsPerAlbum');
      return produce(baseState, draftState => {
        draftState.data.songsPerAlbum[albumId] = get(action, ['payload', 'songs'], []);
        draftState.data.albumsById[albumId] = get(action, ['payload']);
      });
    default:
      return state;
  }
};

const API_BASE = process.env.API_BASE;

export const fetchAlbums = () => ({
  [RSAA]: {
    endpoint: `${API_BASE}/albums`,
    method: 'GET',
    types: [
      'FETCH_ALBUMS',
      { type: 'FETCH_ALBUMS_SUCCESS', payload: processApiSuccessResponse },
      'FETCH_ALBUMS_ERROR',
    ],
  },
});

export const fetchTopListenedAlbums = ({ size = 10 } = {}) => ({
  [RSAA]: {
    endpoint: `${API_BASE}/albums/top-listened?size=${size}`,
    method: 'GET',
    types: [
      'FETCH_TOP_LISTENED_ALBUMS',
      { type: 'FETCH_TOP_LISTENED_ALBUMS_SUCCESS', payload: processApiSuccessResponse },
      'FETCH_TOP_LISTENED_ALBUMS_ERROR',
    ],
  },
});

export const fetchAlbum = ({ albumId }) => ({
  [RSAA]: {
    endpoint: `${API_BASE}/albums/${albumId}`,
    method: 'GET',
    types: [
      'FETCH_SINGLE_ALBUM',
      { type: 'FETCH_SINGLE_ALBUM_SUCCESS', payload: processApiSuccessResponse },
      'FETCH_SINGLE_ALBUM_ERROR',
    ],
  },
});

export function initializeStore(initialState = initialState) {
  return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(apiMiddleware)));
}
