import * as React from 'react';
import { IGameArgs } from '../../App/Game/GameBoardWrapper';
import { GameLayout } from '../../App/Game/GameLayout';
import { GameMode } from '../../App/Game/GameModePicker';
import { IGameCtx } from '@freeboardgame.org/boardgame.io/core';
import { IG, getScoreBoard, isAllowedDeck } from './game';
import { Decks } from './Decks';
import { PlayerHand } from './PlayerHand';
import { Scoreboard } from './Scoreboard';
import { ScoreBadges } from './ScoreBadges';

interface IBoardProps {
  G: IG;
  ctx: IGameCtx;
  moves: any;
  step?: any;
  playerID: string;
  gameArgs?: IGameArgs;
}

interface IBoardState {
  aiSecondDeck: boolean;
}

export class Board extends React.Component<IBoardProps, IBoardState> {
  state: IBoardState = { aiSecondDeck: false };

  _selectCard = async (id: number) => {
    if (!this._canPlay() || this.props.ctx.phase !== 'CARD_SELECT') {
      return;
    }
    this.props.moves.selectCard(id);
    if (this.isAIGame()) {
      await this.props.step();
      if (this.props.ctx.currentPlayer === this.props.playerID) {
        this.setState({ aiSecondDeck: true });
      } else {
        this.setState({ aiSecondDeck: false });
        setTimeout(() => {
          this.props.step();
        }, 1000);
      }
    }
  };

  _selectDeck = (id: number) => {
    if (
      !this._canPlay() ||
      this.props.ctx.phase !== 'DECK_SELECT' ||
      !isAllowedDeck(this.props.G, id, this.props.playerID)
    ) {
      return;
    }
    this.props.moves.selectDeck(id);
    if (this.isAIGame() && this.state.aiSecondDeck) {
      setTimeout(() => {
        this.props.step();
      }, 1000);
    }
  };

  _getStatus() {
    if (!this.props.gameArgs) {
      return;
    }
    if (!this._canPlay()) {
      return 'Waiting for opponent...';
    }
    if (this.props.ctx.phase === 'CARD_SELECT') {
      return 'SELECT CARD';
    } else {
      return 'SELECT BOARD';
    }
  }

  _canPlay() {
    return this.props.ctx.actionPlayers.some(player => player === this.props.playerID);
  }

  _getGameOver() {
    if (this.props.ctx.gameover.winner !== undefined) {
      if (this.props.ctx.gameover.winner === this.props.playerID) {
        return 'you won';
      } else {
        return 'you lost';
      }
    } else {
      return 'draw';
    }
  }

  _getScoreBoard() {
    return (
      <Scoreboard
        scoreboard={getScoreBoard(this.props.G)}
        playerID={this.props.playerID}
        players={this.props.gameArgs.players}
      />
    );
  }

  isAIGame() {
    return this.props.gameArgs.mode === GameMode.AI;
  }

  render() {
    if (this.props.ctx.gameover) {
      return (
        <GameLayout
          gameOver={this._getGameOver()}
          extraCardContent={this._getScoreBoard()}
          gameArgs={this.props.gameArgs}
        />
      );
    }

    if (this.props.playerID === null) {
      return (
        <GameLayout>
          <div>
            <svg />
          </div>
        </GameLayout>
      );
    }

    return (
      <GameLayout>
        <h2 style={{ textAlign: 'center', marginTop: '0', marginBottom: '8px' }}>{this._getStatus()}</h2>
        <Decks G={this.props.G} ctx={this.props.ctx} playerID={this.props.playerID} selectDeck={this._selectDeck} />
        <PlayerHand G={this.props.G} playerID={this.props.playerID} selectCard={this._selectCard} />
        <ScoreBadges
          scoreboard={getScoreBoard(this.props.G)}
          playerID={this.props.playerID}
          players={this.props.gameArgs.players}
        />
      </GameLayout>
    );
  }
}

export default Board;
