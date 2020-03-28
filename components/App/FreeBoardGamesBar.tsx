import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FbgLogo from './media/fbg_logo_white_48.png';
import Link from 'next/link';

interface FBGBarProps {
  FEATURE_FLAG_readyForDesktopView?: boolean;
}

class FreeBoardGamesBar extends React.Component<FBGBarProps, {}> {
  render() {
    const isProdChannel = process.env.NODE_ENV === 'production';
    let appBarStyle;
    let versionInfo;

    if (!isProdChannel) {
      appBarStyle = { background: 'red' };
      versionInfo = (
        <Typography data-test-id="gitrev" variant="h6" style={{ color: 'white', marginLeft: 'auto' }}>
          {process.env.VERSION}
        </Typography>
      );
    }

    const maxWidth = this.props.FEATURE_FLAG_readyForDesktopView ? '1200px' : '500px';

    return (
      <React.Fragment>
        <div
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <AppBar position="sticky" style={appBarStyle}>
            <Link href="/">
              <a style={{ textDecoration: 'none' }}>
                <Toolbar>
                  <img style={{ marginRight: '8px', height: '48px' }} src={FbgLogo} alt="FbG" />
                  <Typography component="h1" variant="h6" style={{ color: 'white' }}>
                    FreeBoardGames.org
                  </Typography>
                  {versionInfo}
                </Toolbar>
              </a>
            </Link>
          </AppBar>
        </div>
        <div
          style={{
            maxWidth,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {this.props.children}
        </div>
      </React.Fragment>
    );
  }
}

export default FreeBoardGamesBar;
