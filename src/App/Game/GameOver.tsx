import React from 'react';
import { GameMode } from './GameModePicker';
import { IGameArgs } from './GameBoardWrapper';
import { GamesList } from '../GamesList';
import FreeBoardGameBar from '../FreeBoardGameBar';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import ReplayIcon from '@material-ui/icons/Replay';
import ReactGA from 'react-ga';

export interface IGameOverProps {
  result: string;
  gameArgs?: IGameArgs;
}

export class GameOver extends React.Component<IGameOverProps, {}> {
  render() {
    const playAgain = (
      (this.props.gameArgs) && ((this.props.gameArgs.mode === GameMode.AI) ||
        (this.props.gameArgs.mode === GameMode.LocalFriend)));
    let playAgainLink;
    let playAgainText;
    if (playAgain) {
      playAgainLink = (
        <Button
          onClick={this._refreshPage(this.props.gameArgs)}
          variant="outlined"
          style={{ width: '150px', marginRight: '50%', marginLeft: '35%', marginTop: '8px' }}
        >
          <ReplayIcon style={{ marginRight: '8px' }} />
          Play Again
        </Button>);
      playAgainText = 'Check out our games below.';
    } else {
      playAgainText = 'Do you want to play again? Check out our games below.';
    }
    ReactGA.event({
      category: 'GameOver',
      label: this.props.gameArgs.gameCode,
      action: this.props.result,  // 'red won'
    });
    return (
      <FreeBoardGameBar>
        <Typography variant="title" gutterBottom={true} align="center" style={{ marginTop: '16px' }}>
          Game Over, {this.props.result}!
        </Typography>
        {playAgainLink}
        <Typography variant="body1" gutterBottom={true} align="center" style={{ marginTop: '16px' }}>
          {playAgainText}
        </Typography>
        <GamesList />
      </FreeBoardGameBar>
    );
  }
  _refreshPage = (gameArgs: IGameArgs) => (event: React.MouseEvent<HTMLElement>) => {
    ReactGA.event({
      category: 'GameOver',
      action: 'Clicked play again',
      label: gameArgs.gameCode,
    });
    window.location.reload();
  }
}
