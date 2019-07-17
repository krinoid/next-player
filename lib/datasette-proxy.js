import axios from 'axios';
import get from 'lodash/get';
import qs from 'qs';

async function datasetteProxy({ tableName, shape = 'objects', params = {} }) {
  try {
    const queryString = qs.stringify(params);
    const results = await axios(
      `${process.env.MUSIC_DATA_API}/${tableName}.json?_shape=${shape}&${queryString}`
    );
    return get(results, ['data', 'rows']);
  } catch (err) {
    // @TODO log to Sentry
    console.error(err);
    throw new Error('oh no');
  }
}

export default datasetteProxy;
