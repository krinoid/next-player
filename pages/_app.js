import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
import withReduxStore from '../lib/with-redux-store';
import { Provider } from 'react-redux';

import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import theme from '../lib/theme';
import PlayerView from '../ui/PlayerView';

class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props;

    return (
      <Container>
        <Head>
          <title>Audio Player</title>
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <PlayerView>
            <Provider store={reduxStore}>
              <Component {...pageProps} />
            </Provider>
          </PlayerView>
        </ThemeProvider>
        <style jsx global>{`
          #__next {
            height: 100%;
          }
        `}</style>
      </Container>
    );
  }
}

export default withReduxStore(MyApp);
