import createJsonEndpoint from '../../../lib/json-endpoint';
import datasetteProxy from '../../../lib/datasette-proxy';

async function handler(req) {
  const {
    query: { size = 20 },
  } = req;
  return await datasetteProxy({
    tableName: 'albums',
    params: { _size: size, _sort_desc: 'album_favorites' },
  });
}

export default createJsonEndpoint(handler);
