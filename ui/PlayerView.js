import React from 'react';
import { PlayerContextProvider } from '@cassette/core';

import { PlaybackContext } from '../lib/context';
import PlayerLayout from './PlayerLayout';

export default class PlayerView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playlist: [],
      onPlayTrack: this.onPlayTrack,
    };
  }

  onPlayTrack = ({ album, albumSongs, trackId, onSelectTrackIndex, onTogglePause }) => {
    const trackIndex = albumSongs.findIndex(song => song.track_id === trackId);

    // create a album playlist, starting with a initially selected song
    // and with the rest of the songs added after
    // e.g. when track #3 selected (out of #5), the order would be: 3, 4, 5, 1, 2
    const tracksAfterSelected = albumSongs.slice(trackIndex);
    const tracksBeforeSelected = albumSongs.slice(0, trackIndex);

    const albumPlaylist = [...tracksAfterSelected, ...tracksBeforeSelected].map(song => ({
      title: `${song.artist_name} - ${song.track_title}`,
      // url: `http://localhost:3000/api/songs/file/1?track_id=${song.track_id}`,
      url: song.url,
      hasAudio: song.has_audio,
      trackId: song.track_id,
    }));
    const newTrackIndex = this.state.playlist.length;
    this.setState(
      state => ({
        playlist: state.playlist.concat(albumPlaylist),
      }),
      () => {
        onSelectTrackIndex(newTrackIndex);
        onTogglePause(false);
      }
    );
  };

  render() {
    const { children } = this.props;

    return (
      <PlaybackContext.Provider value={this.state}>
        <PlayerContextProvider playlist={this.state.playlist}>
          <PlayerLayout>{children}</PlayerLayout>
        </PlayerContextProvider>
      </PlaybackContext.Provider>
    );
  }
}
