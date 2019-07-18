import React from 'react';
import Link from 'next/link';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100%',
    position: 'relative',
    paddingBottom: '50px',
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingBottom: theme.spacing(2),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all .15s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  loader: {
    margin: theme.spacing(2),
  },
}));

export default ({ albums = [], title }) => {
  const classes = useStyles();

  return (
    <section className={classes.root}>
      <Typography gutterBottom variant="h6" component="h2">
        {title}
      </Typography>
      <Grid container spacing={2}>
        {!albums || albums.length === 0 ? (
          <CircularProgress size={20} className={classes.loader} />
        ) : (
          albums.map(album => (
            <Grid item xs={12} sm={4} md={3} key={album.album_id}>
              <Link href="/album/[albumId]" as={`/album/${album.album_id}`}>
                <Card className={classes.card} key={`album-${album.album_id}`} elevation={2}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={album.album_image_file}
                    title={`Cover of ${album.album_title}`}
                  />

                  <CardContent className={classes.cardContent}>
                    <Typography variant="h6" component="h2">
                      {album.album_title}
                    </Typography>
                    <Typography variant="body1">{album.artist_name}</Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))
        )}
      </Grid>
    </section>
  );
};
