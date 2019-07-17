import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { usePlayerContext } from '@cassette/hooks';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PlayIcon from '@material-ui/icons/PlayCircleOutlineOutlined';
import PauseIcon from '@material-ui/icons/PauseCircleFilled';
import MusicOffIcon from '@material-ui/icons/MusicOffRounded';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import { fetchAlbum } from '../../store';
import { getRequestStatus, getAlbumSongs, getAlbumById } from '../../data/selectors';
import { PlaybackContext } from '../../lib/context';

import Error from '../../ui/Error';

const useStyles = makeStyles(theme => ({
  cover: {
    width: '100%',
    maxWidth: '500px',
    borderRadius: '5px',
    boxShadow: '2px 2px 4px #666',
  },
  loader: {
    margin: theme.spacing(2),
  },
  tracklist: {
    margin: theme.spacing(2, 0, 1),
  },
}));

const isTrackPlaying = (playlist, activeIndex, trackId, isPaused) => {
  if (isPaused) return false;
  return playlist[activeIndex].trackId === trackId;
};

function SongTitle({ title, hasAudio }) {
  return (
    <Grid container spacing={3}>
      <Grid item>
        <Typography variant="subtitle2" component="h4">
          {title}
        </Typography>
      </Grid>
      <Grid item>{!hasAudio && <MusicOffIcon color="disabled" />}</Grid>
    </Grid>
  );
}

function Album({ album, albumSongs, status }) {
  if (status === 'ERROR')
    return <Error message="Failed to fetch album data, try again later. Sorry about that :(" />;

  const classes = useStyles();
  const { onPlayTrack } = useContext(PlaybackContext);

  const {
    playlist,
    paused,
    onTogglePause,
    activeTrackIndex,
    onSelectTrackIndex,
  } = usePlayerContext([
    'playlist',
    'paused',
    'onTogglePause',
    'activeTrackIndex',
    'onSelectTrackIndex',
  ]);

  const isLoading = status === 'LOADING' && (!albumSongs || albumSongs.length === 0);

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <img src={album.album_image_file} className={classes.cover} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography gutterBottom variant="h5" component="h2">
            {album.album_title}
          </Typography>
          <Typography>{album.artist_name}</Typography>
          <Paper className={classes.tracklist}>
            {isLoading ? (
              <CircularProgress className={classes.loader} size={20} />
            ) : (
              <List dense={false}>
                {albumSongs.map((song, idx) => {
                  const isPlaying = isTrackPlaying(
                    playlist,
                    activeTrackIndex,
                    song.track_id,
                    paused
                  );

                  return (
                    <ListItem key={song.track_id}>
                      <ListItemIcon
                        onClick={() =>
                          isPlaying
                            ? onTogglePause(true)
                            : onPlayTrack({
                                album,
                                albumSongs,
                                onSelectTrackIndex,
                                onTogglePause,
                                trackId: song.track_id,
                              })
                        }
                        style={{ cursor: 'pointer' }}
                      >
                        {isPlaying ? <PauseIcon /> : <PlayIcon />}
                      </ListItemIcon>

                      <ListItemText
                        primary={<SongTitle title={song.track_title} hasAudio={song.has_audio} />}
                        secondary={song.artist_name}
                      />
                    </ListItem>
                  );
                })}
              </List>
            )}
          </Paper>
          {album.album_date_released && (
            <Typography gutterBottom variant="caption">
              Release date: {album.album_date_released}
            </Typography>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

Album.getInitialProps = async ({ query, req, reduxStore }) => {
  const { albumId } = query;
  if (req) {
    // when on the server, we're awaiting until the fetch completes,
    // so we can SSR full page when requested directly
    await reduxStore.dispatch(fetchAlbum({ albumId }));
  } else {
    // for client-side request we don't block the render,
    // so we can show album cover and load additional data in the background
    reduxStore.dispatch(fetchAlbum({ albumId }));
  }
  return { albumId };
};

export default connect((state, ownProps) => ({
  album: getAlbumById(state, ownProps.albumId),
  albumSongs: getAlbumSongs(state, ownProps.albumId),
  status: getRequestStatus(state, 'songsPerAlbum'),
}))(Album);
