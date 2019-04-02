/*
 * Copyright 2018 The @freeboardgame.org/boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React from 'react';

import Chess from './chessjswrapper';
import { Checkerboard, IAlgebraicCoords, IColorMap } from './checkerboard';
import { Token } from '@freeboardgame.org/boardgame.io/ui';
import { IGameArgs } from '../../App/Game/GameBoardWrapper';
import { GameLayout } from '../../App/Game/GameLayout';
import { GameMode } from '../../App/Game/GameModePicker';
import Bishop from './pieces/bishop';
import King from './pieces/king';
import Knight from './pieces/knight';
import Pawn from './pieces/pawn';
import Queen from './pieces/queen';
import Rook from './pieces/rook';
import AlertLayer from '../../App/Game/AlertLayer';
import ReactGA from 'react-ga';

const COL_NAMES = 'abcdefgh';
const SELECTED_COLOR = 'green';
const MOVABLE_COLOR = 'palegreen';

interface IBoardProps {
  G: any;
  ctx: any;
  moves: any;
  step: any;
  playerID: string;
  isActive: boolean;
  isConnected: boolean;
  gameArgs?: IGameArgs;
}

export class Board extends React.Component<IBoardProps, {}> {
  chess = Chess();
  state = {
    selected: '',
  };
  _click = this.click.bind(this);

  render() {
    if (this.props.G.pgn) {
      this.chess.load_pgn(this.props.G.pgn);
    }
    if (this.props.ctx.gameover) {
      return (
        <GameLayout
          gameOver={this._getGameOver()}
          gameArgs={this.props.gameArgs}
        />
      );
    }
    return (
      <GameLayout>
        <div>
          <h2 style={{ textAlign: 'center' }}>
            {this._getStatus()}
          </h2>
          <Checkerboard
            invert={this.getPlayer() === 'b'}
            highlightedSquares={this._getHighlightedSquares()}
            onClick={this._click}
          >
            {this._getPieces()}
          </Checkerboard>
        </div>
      </GameLayout>
    );
  }

  getPlayer(): 'w' | 'b' {
    if (this.props.playerID === '1') {
      return 'b';
    } else {
      return 'w';
    }
  }

  click(coords: IAlgebraicCoords) {
    ReactGA.event({
      category: 'ChessGame',
      action: 'click',
    });
    const { square } = coords;
    if (!this.props.isActive) {
      return;
    }

    if (!this.state.selected && this._isSelectable(square)) {
      this.setState({
        ...this.state,
        selected: square,
      });
    }

    if (this.state.selected) {
      const moves = this._getMoves();
      const move = moves.find((m: any) => {
        return m.from === this.state.selected && m.to === square;
      });
      if (move) {
        this.props.moves.move(move.san);
        if (this.props.gameArgs && this.props.gameArgs.mode === GameMode.AI) {
          this.props.step();
        }
      }
      this.setState({
        ...this.state,
        selected: '',
      });
    }
  }

  _getHighlightedSquares() {
    const result = {} as IColorMap;
    if (this.state.selected) {
      result[this.state.selected] = SELECTED_COLOR;
    }
    for (const move of this._getMoves()) {
      result[move.to] = MOVABLE_COLOR;
    }
    return result;
  }

  _getPieces() {
    const result = [];
    for (let y = 1; y <= 8; y++) {
      for (let x = 0; x < 8; x++) {
        const square = COL_NAMES[x] + y;
        const p = this.chess.get(square);
        if (p) {
          result.push(
            <Token
              square={square}
              animate={true}
              key={this._getInitialCell(square)}
              onClick={this._click}
            >
              {this._getPieceByTypeAndColor(p.type, p.color)}
            </Token>,
          );
        }
      }
    }
    return result;
  }

  _getPieceByTypeAndColor(type: string, color: string) {
    switch (type) {
      case 'b':
        return <Bishop color={color} />;
      case 'k':
        return <King color={color} />;
      case 'n':
        return <Knight color={color} />;
      case 'p':
        return <Pawn color={color} />;
      case 'q':
        return <Queen color={color} />;
      case 'r':
        return <Rook color={color} />;
    }
  }

  _getGameOver() {
    const gameArgs = this.props.gameArgs;
    const mode = typeof gameArgs !== 'undefined' ? gameArgs.mode : GameMode.LocalFriend;
    if (mode === GameMode.OnlineFriend || mode === GameMode.AI) {
      if (this.props.ctx.gameover === this.getPlayer()) {
        return 'you won';
      } else if (this.props.ctx.gameover === 'd') {
        return 'draw';
      } else {
        return 'you lost';
      }
    } else { // Local game
      switch (this.props.ctx.gameover) {
        case 'w': return 'white won';
        case 'b': return 'black won';
        case 'd': return 'draw';
      }
    }
  }

  _getStatus() {
    // Online Multiplayer
    if (this.props.gameArgs && this.props.gameArgs.mode === GameMode.OnlineFriend) {
      if (this.chess.in_check()) {
        return 'CHECK';
      }
      if (this.chess.turn() === this.getPlayer()) {
        return 'YOUR TURN';
      } else {
        return 'Waiting for opponent...';
      }
    } else { // Local game
      if (this.chess.in_check()) {
        return 'CHECK';
      }
      switch (this.chess.turn()) {
        case 'w': return 'White\'s turn';
        case 'b': return 'Black\'s turn';
      }
    }
  }

  _getInitialCell(square: string) {
    const history = this._fixHistory(this.chess.history({ verbose: true }));
    let lastSeen = square;
    for (let i = history.length - 1; i >= 0; i--) {
      const move = history[i];
      if (lastSeen === move.to) {
        lastSeen = move.from;
      }
    }
    return lastSeen;
  }

  // Castling only contains one move, leading to wrong initial cell.
  _fixHistory(history: any) {
    const result = [];
    for (const move of history) {
      let newMove = null;
      if (move.san === 'O-O-O') {
        if (move.color === 'w') {
          newMove = { from: 'a1', to: 'd1' };
        } else {
          newMove = { from: 'a8', to: 'd8' };
        }
      } else if (move.san === 'O-O') {
        if (move.color === 'w') {
          newMove = { from: 'h1', to: 'f1' };
        } else {
          newMove = { from: 'h8', to: 'f8' };
        }
      }
      result.push(move);
      if (newMove) {
        result.push(newMove);
      }
    }
    return result;
  }

  _isSelectable(square: string) {
    const piece = this.chess.get(square);
    return (
      piece &&
      piece.color === this._getCurrentPlayer() &&
      this.chess.moves({ square }).length > 0
    );
  }

  _getCurrentPlayer() {
    if (this.props.ctx.currentPlayer === '0') {
      return 'w';
    } else {
      return 'b';
    }
  }

  _getMoves() {
    if (!this.state.selected) {
      return [];
    }
    return this.chess.moves({
      verbose: true,
      square: this.state.selected,
    });
  }
}
