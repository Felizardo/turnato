import { IG, CardColor, Team, TeamColor, Phases } from './definitions';
import { Ctx } from 'boardgame.io';
import { IGameArgs } from '../../components/App/Game/GameBoardWrapper';
import * as React from 'react';
import css from './board.css';
import { isLocalGame, isOnlineGame } from '../common/gameMode';
import Button from '@material-ui/core/Button';
import { IPlayerInRoom } from 'components/App/Lobby/LobbyService';
import { getPlayerTeam, isPlayerSpymaster } from './util';
import { PlayerBadges } from 'games/common/PlayerBadges';

interface IPlayBoardProps {
  G: IG;
  ctx: Ctx;
  moves: any;
  events: any;
  playerID: string;
  gameArgs?: IGameArgs;
  isActive: boolean;
  isHost: boolean;
  isGameOver?: boolean;
}

interface IPlayBoardState {
  spymasterView: boolean;
}

export class PlayBoard extends React.Component<IPlayBoardProps, IPlayBoardState> {
  state = {
    spymasterView: false,
  };

  _isActive() {
    return isLocalGame(this.props.gameArgs) || this.props.isActive;
  }

  _currentPlayerInRoom(): IPlayerInRoom {
    return this.props.gameArgs.players[this._currentPlayerID()];
  }

  _currentPlayerTeam(): Team {
    return getPlayerTeam(this.props.G, this._currentPlayerID());
  }

  _currentPlayerID(): string {
    return this.props.ctx.currentPlayer;
  }

  _playerID(): string {
    if (isLocalGame(this.props.gameArgs)) {
      return this._currentPlayerID();
    } else {
      return this.props.playerID;
    }
  }

  _playerTeam(): Team {
    return this.props.G.teams[this._playerID()];
  }

  _showSpymasterView = (): boolean =>
    this.props.isGameOver || (isPlayerSpymaster(this.props.G, this._playerID()) && this.state.spymasterView);

  _toggleSpymasterView = (): void => this.setState({ spymasterView: !this.state.spymasterView });

  _clueGiven = () => {
    if (!this._isActive()) return;

    this.props.moves.clueGiven();
  };

  _chooseCard = (cardIndex: number) => {
    if (!this._isActive()) return;
    if (this.props.ctx.phase !== Phases.guess) return;
    if (isOnlineGame(this.props.gameArgs) && isPlayerSpymaster(this.props.G, this._playerID())) return;
    if (this.props.G.cards[cardIndex].revealed) return;

    this.props.moves.chooseCard(cardIndex);
  };

  _pass = () => {
    if (!this._isActive()) return;

    this.props.moves.pass();
  };

  _renderHeader = () => {
    let instruction;

    if (this.props.ctx.phase === Phases.giveClue) {
      const button = this._isActive() ? (
        <Button className={css.playActionBtn} variant="contained" onClick={this._clueGiven} color="primary">
          Done
        </Button>
      ) : null;
      instruction = (
        <p>
          <strong>{this._currentPlayerInRoom().name}</strong> give your teammates a clue!
          {button}
        </p>
      );
    } else {
      const button = this._isActive() ? (
        <Button className={css.playActionBtn} variant="contained" onClick={this._pass}>
          Pass
        </Button>
      ) : null;
      instruction = (
        <p>
          <strong>{this._currentPlayerTeam().color === TeamColor.Red ? 'Red' : 'Blue'} Team</strong> make your guess!
          {button}
        </p>
      );
    }

    return (
      <div className={css.header}>
        <h3 className={this._currentPlayerTeam().color === TeamColor.Red ? css.redTitle : css.blueTitle}>
          {this._currentPlayerTeam().color === TeamColor.Red ? 'Red' : 'Blue'} Team
        </h3>
        {instruction}
      </div>
    );
  };

  _renderCardGrid = () => {
    let board = [];

    for (let i = 0; i < 25; i += 1) {
      const card = this.props.G.cards[i];

      const classes = [css.card];
      if (card.revealed || this._showSpymasterView()) {
        if (card.color === CardColor.blue) classes.push(css.cardBlue);
        else if (card.color === CardColor.red) classes.push(css.cardRed);
        else if (card.color === CardColor.civilian) classes.push(css.cardCivilian);
        else if (card.color === CardColor.assassin) classes.push(css.cardAssassin);

        classes.push(css.cardRevealed);
      }

      board.push(
        <div className={classes.join(' ')} key={i} onClick={() => this._chooseCard(i)}>
          {card.word}
        </div>,
      );
    }

    return <div className={css.board}>{board}</div>;
  };

  _renderPlayerBadges = () => {
    const colors = this.props.gameArgs.players
      .map((player) => player.playerID.toString())
      .map((playerID) => getPlayerTeam(this.props.G, playerID).color)
      .map((color) => (color == TeamColor.Red ? '#F25F5C' : '#247BA0'));
    return (
      <PlayerBadges
        playerID={this.props.playerID}
        players={this.props.gameArgs.players}
        colors={colors}
        ctx={this.props.ctx}
      />
    );
  };

  _renderActionButtons = () => {
    if (isPlayerSpymaster(this.props.G, this._playerID())) {
      return (
        <Button className={css.selectTeamBtn} variant="contained" onClick={this._toggleSpymasterView}>
          Toggle View: {this.state.spymasterView ? 'Spymaster' : 'Normal'}
        </Button>
      );
    }
  };

  render() {
    if (this.props.isGameOver) {
      return this._renderCardGrid();
    }
    return (
      <div>
        {this._renderHeader()}
        {this._renderCardGrid()}
        {this._renderActionButtons()}
        {this._renderPlayerBadges()}
      </div>
    );
  }
}
