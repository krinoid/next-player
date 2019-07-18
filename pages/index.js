import React from 'react';
import { connect } from 'react-redux';

import { getRequestStatus, getAlbums, getTopListenedAlbums } from '../data/selectors';
import { fetchAlbums, fetchTopListenedAlbums } from '../store';

import Error from '../ui/Error';
import AlbumsSection from '../ui/AlbumsSection';

function Home({ albums, status, topListenedStatus, topListenedAlbums }) {
  if (status === 'ERROR' || topListenedStatus === 'ERROR') return <Error />;

  return (
    <>
      <AlbumsSection albums={topListenedAlbums} title="Top Listened Albums" />
      <AlbumsSection albums={albums} title="Random Albums" />
    </>
  );
}

Home.getInitialProps = async ({ reduxStore, req }) => {
  const dispatchFetch = Promise.all([
    reduxStore.dispatch(fetchTopListenedAlbums({ size: 24 })),
    reduxStore.dispatch(fetchAlbums()),
  ]);
  if (req) {
    await dispatchFetch
  }
  return {};
};

export default connect(state => ({
  albums: getAlbums(state),
  topListenedAlbums: getTopListenedAlbums(state),
  topListenedStatus: getRequestStatus(state, 'topListenedAlbums'),
  status: getRequestStatus(state, 'albums'),
}))(Home);
