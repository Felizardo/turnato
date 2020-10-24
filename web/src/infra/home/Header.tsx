import React from 'react';
import Button from '@material-ui/core/Button';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import SubjectIcon from '@material-ui/icons/Subject';
import CodeIcon from '@material-ui/icons/Code';
import Typography from '@material-ui/core/Typography';

class Header extends React.Component<{}, {}> {
  render() {
    return (
      <div style={{ padding: '0 8px' }}>
        <Typography component="h1" variant="h6" gutterBottom={true} align="center" style={{ marginTop: '16px' }}>
          Play Free Board Games
        </Typography>
        <Typography
          component="h2"
          variant="body2"
          gutterBottom={true}
          style={{ marginTop: '16px', marginBottom: '16px' }}
        >
          FreeBoardGames.org is a <b>free and open-source</b> board game platform. Enjoy free high-quality games on any
          device that can access the web. Study how the games are made, change them, and contribute back to the
          community!
        </Typography>
        {this._links()}
      </div>
    );
  }
  _links() {
    return (
      <div style={{ textAlign: 'center', marginTop: '4px' }}>
        <Button
          href="https://github.com/freeboardgames/FreeBoardGames.org"
          target="_blank"
          variant="outlined"
          rel="noopener"
          style={{ margin: '8px' }}
        >
          <CodeIcon style={{ marginRight: '4px' }} />
          Code
        </Button>
        <Button href="/docs/" target="_blank" variant="outlined" style={{ margin: '4px' }}>
          <SubjectIcon style={{ marginRight: '4px' }} />
          Docs
        </Button>
        <Button
          href="https://discord.gg/AaE6n3n"
          target="_blank"
          variant="outlined"
          rel="noopener"
          style={{ margin: '4px' }}
        >
          <QuestionAnswerIcon style={{ marginRight: '4px' }} />
          Chat
        </Button>
      </div>
    );
  }
}

export default Header;
