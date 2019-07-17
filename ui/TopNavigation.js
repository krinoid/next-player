import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';

import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  loader: {
    marginRight: theme.spacing(2),
    color: '#fff'
  },
}));

export default () => {
  const classes = useStyles();
  const [transitionInProgress, setTransition] = useState(false);
  useEffect(() => {
    const handleRouteChange = () => {
      setTransition(true);
    };
    const handleRouteComplete = () => setTransition(false);
    const handleRouteError = () => setTransition(false);

    Router.events.on('routeChangeStart', handleRouteChange);
    Router.events.on('routeChangeComplete', handleRouteComplete);
    Router.events.on('routeChangeError', handleRouteError);
    return () => {
      Router.events.off('routeChangeStart', handleRouteChange);
      Router.events.off('routeChangeComplete', handleRouteComplete);
      Router.events.off('routeChangeError', handleRouteError);
    };
  }, []);

  return (
    <AppBar position="relative">
      <Toolbar>
        {transitionInProgress ? (
          <CircularProgress className={classes.loader} size={20} />
        ) : (
          <LibraryMusicIcon className={classes.icon} />
        )}
        <Link href="/">
          <Typography variant="h6" color="inherit" noWrap>
            auladio
          </Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
};
