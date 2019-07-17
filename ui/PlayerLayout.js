import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import TopNavigation from '../ui/TopNavigation';
import PlayerBar from './PlayerBar';

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100%',
    position: 'relative',
    paddingBottom: '150px',
  },
  content: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(4, 0, 6),
  },
  cardGrid: {
    paddingBottom: theme.spacing(2),
  },
  footer: {
    boxShadow: '0px -2px 8px #333',
    position: 'fixed',
    height: '50px',
    width: '100%',
    left: 0,
    right: 0,
    bottom: 0,
  },
}));

export default function PlayerView({ children }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <TopNavigation />
      <main className={classes.content}>
        <Container className={classes.cardGrid} maxWidth={false}>
          {children}
        </Container>
      </main>
      <footer className={classes.footer}>
        <PlayerBar />
      </footer>
    </div>
  );
}
