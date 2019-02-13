import * as React from 'react';
import Typography from '@material-ui/core/Typography';

interface IGameDarkSublayoutProps {
  children: React.ReactNode;
}

export class GameDarkSublayout extends React.Component<IGameDarkSublayoutProps, {}> {
  constructor(props: IGameDarkSublayoutProps) {
    super(props);
    if (typeof window !== 'undefined') {
      document.body.style.backgroundColor = 'black';
    }
  }

  componentWillUnmount() {
    document.body.style.backgroundColor = undefined;
  }

  render() {
    return (
      <div>
        <div
          style={{
            position: 'fixed',
            top: '0',
            width: '100%',
          }}
        >
          <div
            style={{
              maxWidth: '500px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            <a href="/" style={{ textDecoration: 'none' }}>
              <img
                src="/logo/fbg_logo_white_48.png"
                alt="FreeBoardGame.org"
                style={{ float: 'left', paddingRight: '16px' }}
              />
              <Typography
                variant="title"
                gutterBottom={true}
                style={{ paddingTop: '14px', color: 'white' }}
              >
                FreeBoardGame.org
              </Typography>
            </a>
          </div>
        </div>
        <div
          style={{
            position: 'fixed',
            width: '100%',
            maxWidth: '500px',
            color: 'white',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}
