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

  makeCross(x: number, y: number) {
    return (
      <g className="cross" key={`cross${x},${y}`}>
        <line
          x1={x}
          y1={y}
          x2={x + 1}
          y2={y + 1}
          style={this.lineStyle}
        />,
        <line
          x1={x + 1}
          y1={y}
          x2={x}
          y2={y + 1}
          style={this.lineStyle}
        />
      </g>
    );
  }

  makeCircle(x: number, y: number) {
    return (
      <circle
        key={`circle${x},${y}`}
        cx={x + .5}
        cy={y + .5}
        r=".45"
        fill="none"
        style={this.lineStyle}
      />
    );
  }

  isActive(id: number) {
    return this.props.isActive && this.props.G.cells[id] === null;
  }

  getPlayer(): 'X' | 'O' {
    if (this.props.playerID === '0') {
      return 'X';
    } else {
      return 'O';
    }
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
        case '0': return 'X\'s turn';
        case '1': return 'O\'s turn';
      }
    }
  }

  _getGameOver() {
    if (this.props.gameArgs && this.props.gameArgs.mode === GameMode.OnlineFriend) {
      // Online game
      if (this.props.ctx.gameover.winner !== undefined) {
        if (this.props.ctx.gameover.winner !== this.props.playerID) {
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
        case '0': return 'X won';
        case '1': return 'O won';
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
    const lines = [
      <line key="line1" x1="1" y1="0" x2="1" y2="3" style={this.lineStyle} />,
      <line key="line2" x1="2" y1="0" x2="2" y2="3" style={this.lineStyle} />,
      <line key="line3" x1="0" y1="1" x2="3" y2="1" style={this.lineStyle} />,
      <line key="line4" x1="0" y1="2" x2="3" y2="2" style={this.lineStyle} />,
      <line key="line5" x1="0" y1="1" x2="3" y2="1" style={this.lineStyle} />,
    ];
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
          overlay = this.makeCross(i, j);
        } else if (this.props.G.cells[id] === '1') {
          overlay = this.makeCircle(i, j);
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
            {lines}
          </svg>
        </div>
      </GameLayout>
    );
  }
}

export default Board;
