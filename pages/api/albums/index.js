import createJsonEndpoint from '../../../lib/json-endpoint';
import datasetteProxy from '../../../lib/datasette-proxy';

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomRange() {
  const [a, b] = [getRandomInt(0, 15000), getRandomInt(0, 15000)].sort((a, b) => a - b);
  const numbersInRange = b - a;
  // if there's less than 25 numbers in the range, expand the range,
  // so we dont' return just 3 albums on some occasions
  // we're adding 100, cause there are some gaps in the IDs (e.g. 1, 3, 7)
  return numbersInRange < 25 ? [a, b + 100] : [a, b];
}

async function handler(req, res) {
  const randomRange = getRandomRange();
  return await datasetteProxy({
    tableName: 'albums',
    params: { _size: 25, album_id__gte: randomRange[0], album_id__lte: randomRange[1] },
  });
}

export default createJsonEndpoint(handler);
