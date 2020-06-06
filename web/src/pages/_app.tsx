/* eslint-disable react/react-in-jsx-scope */

import App from 'next/app';
import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from 'infra/common/components/base/theme';
import { SelfXSSWarning } from 'infra/common/components/base/SelfXSSWarning';
import { isMobileFromReq } from 'infra/common/device/UaHelper';
import UaContext from 'infra/common/device/IsMobileContext';
import withError from 'next-with-error';
import ErrorPage from './_error';
import ReactGA from 'react-ga';
import Router from 'next/router';
import * as Sentry from '@sentry/browser';

import { wrapper } from 'infra/common/redux/store';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
});

class defaultApp extends App {
  logPageView(path: string) {
    ReactGA.set({ page: path });
    ReactGA.pageview(path);
  }

  componentDidMount() {
    // Remove the server-side injected CSS:
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }

    // Initialize Google Analytics:
    if (!(window as any).GA_INITIALIZED) {
      const GA_TRACKING_CODE = process.env.GA_TRACKING_CODE;
      ReactGA.initialize(GA_TRACKING_CODE);
      (window as any).GA_INITIALIZED = true;
      if (process.env.SENTRY_DSN) {
        const version = process.env.VERSION;
        const channel = process.env.CHANNEL;
        let release;
        if (version && channel) release = `${version}-${channel}`;
        Sentry.init({ dsn: process.env.SENTRY_DSN, release });
      }
    }
    // https://github.com/sergiodxa/next-ga/blob/32899e9635efe1491a5f47469b0bd2250e496f99/src/index.js#L32
    (Router as any).onRouteChangeComplete = (path: string) => {
      this.logPageView(path);
    };
    this.logPageView(window.location.pathname);
  }
  render() {
    const { Component, pageProps, isMobile } = this.props as any;
    return (
      <ThemeProvider theme={theme}>
        <SelfXSSWarning />
        <UaContext.Provider value={isMobile}>
          <ApolloProvider client={client}>
            <Component {...pageProps} />
          </ApolloProvider>
        </UaContext.Provider>
      </ThemeProvider>
    );
  }
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    const isMobile = isMobileFromReq(ctx.req);
    return { pageProps, isMobile };
  }
}

export default wrapper.withRedux(withError(ErrorPage)(defaultApp));
