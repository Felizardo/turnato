/*
 * Copyright 2017 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import * as React from 'react';
import * as PropTypes from 'prop-types';
import { IGameArgs } from '../../App/Game/GameBoardWrapper';
import { GameLayout } from '../../App/Game/GameLayout';
import { GameMode } from '../../App/Game/GameModePicker';
import { Circle, Cross, Lines } from './Shapes';
import Typography from '@material-ui/core/Typography';

interface IBoardProps {
  G: any;
  ctx: any;
  moves: any;
  playerID: string;
  isActive: boolean;
  gameArgs?: IGameArgs;
}

export class Board extends React.Component<IBoardProps, {}> {
  private lineStyle = {
    stroke: 'white',
    strokeWidth: .05,
  };

  onClick = (id: number) => () => {
    if (this.isActive(id)) {
      this.props.moves.clickCell(id);
    }
  }

  isActive(id: number) {
    return this.props.isActive && this.props.G.cells[id] === null;
  }

  isOnlineGame() {
    return (this.props.gameArgs && this.props.gameArgs.mode === GameMode.OnlineFriend);
  }

  _getStatus() {
    if (this.isOnlineGame()) {
      if (this.props.ctx.currentPlayer === this.props.playerID) {
        return 'YOUR TURN';
      } else {
        return 'Waiting for opponent...';
      }
    } else { // Local game
      switch (this.props.ctx.currentPlayer) {
        case '0': return 'Red\'s turn';
        case '1': return 'Green\'s turn';
      }
    }
  }

  _getGameOver() {
    if (this.props.gameArgs && this.props.gameArgs.mode === GameMode.OnlineFriend) {
      // Online game
      if (this.props.ctx.gameover.winner !== undefined) {
        if (this.props.ctx.gameover.winner === this.props.playerID) {
          return 'you won';
        } else {
          return 'you lost';
        }
      } else {
        return 'draw';
      }
    } else {
      // Local game
      switch (this.props.ctx.gameover.winner) {
        case '0': return 'Red won';
        case '1': return 'Green won';
        case undefined: return 'draw';
      }
    }
  }

  render() {
    if (this.props.ctx.gameover) {
      return (
        <GameLayout gameOver={this._getGameOver()} />
      );
    }
    const cellStyle = {
      border: '1px solid #555',
      width: '50px',
      height: '50px',
      lineHeight: '50px',
    };
    const cells = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const id = 3 * i + j;
        cells.push(
          <rect
            key={`${id}`}
            x={i}
            y={j}
            width="1"
            height="1"
            fill="black"
            onClick={this.onClick(id)}
          />,
        );
        let overlay;
        if (this.props.G.cells[id] === '0') {
          overlay = <Cross x={i} y={j} key={`cross${id}`} />;
        } else if (this.props.G.cells[id] === '1') {
          overlay = <Circle x={i} y={j} key={`circle${id}`} />;
        }
        if (overlay) {
          cells.push(overlay);
        }
      }
    }

    return (
      <GameLayout>
        <div>
          <h2 style={{ textAlign: 'center' }}>
            {this._getStatus()}
          </h2>
          <svg width="100%" height="100%" viewBox="0 0 3 3">
            {cells}
            {Lines}
          </svg>
        </div>
      </GameLayout>
    );
  }
}

export default Board;
