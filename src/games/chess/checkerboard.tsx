/*
 * Copyright 2018 The flamecoals-boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'flamecoals-boardgame.io/ui';

/**
 * Checkerboard
 *
 * Component that will show a configurable checker board for games like
 * chess, checkers and others. The vertical columns of squares are labeled
 * with letters from a to z, while the rows are labeled with numbers, starting
 * with 1.
 *
 * Props:
 *   rows    - How many rows to show up, 8 by default.
 *   cols    - How many columns to show up, 8 by default. Maximum is 26.
 *   onClick - On Click Callback, (row, col) of the square passed as argument.
 *   primaryColor - Primary color, #d18b47 by default.
 *   secondaryColor - Secondary color, #ffce9e by default.
 *   colorMap - Object of object having cell names as key and colors as values.
 *   Ex: { 'c5': 'red' } colors cells c5 with red.
 *
 * Usage:
 *
 * <Checkerboard>
 *   <Token square={'c5'}>
 *     <Knight color='dark' />
 *   </Token>
 * </Checkerboard>
 */
export interface IAlgebraicCoords {
  square: string;
}
export interface ICartesianCoords {
  x: number;
  y: number;
}
export interface IColorMap {
  [key: string]: string;
}
interface ICheckerboardProps {
  rows: number;
  cols: number;
  onClick: (coords: ICartesianCoords) => void;
  invert: boolean;
  primaryColor: string;
  secondaryColor: string;
  highlightedSquares: IColorMap;
  style: React.CSSProperties;
  children?: any;
}
export class Checkerboard extends React.Component<any, any> {
  static propTypes = {
    rows: PropTypes.number,
    cols: PropTypes.number,
    onClick: PropTypes.func,
    primaryColor: PropTypes.string,
    secondaryColor: PropTypes.string,
    invert: PropTypes.bool,
    highlightedSquares: PropTypes.object,
    style: PropTypes.object,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.element),
      PropTypes.element,
    ]),
  };

  static defaultProps = {
    rows: 8,
    cols: 8,
    invert: false,
    primaryColor: '#d18b47',
    secondaryColor: '#ffce9e',
    highlightedSquares: {},
    style: {},
  };
  _onClick = this.onClick.bind(this);

  onClick(coords: ICartesianCoords) {
    const { x, y } = coords;
    this.props.onClick({ square: this._cartesianToAlgebraic(x, y) });
  }

  render() {
    // Convert the square="" prop to x and y.
    const tokens = React.Children.map(this.props.children, (child: any) => {
      const square = child.props.square;
      const { x, y } = this._algebraicToCartesian(square);
      return React.cloneElement(child, { x, y });
    });

    // Build colorMap with checkerboard pattern.
    const colorMap = {} as IColorMap;
    for (let x = 0; x < this.props.cols; x++) {
      for (let y = 0; y < this.props.rows; y++) {
        const key = `${x},${y}`;
        let color = this.props.secondaryColor;
        if ((x + y) % 2 === 0) {
          color = this.props.primaryColor;
        }
        colorMap[key] = color;
      }
    }

    // Add highlighted squares.
    for (const square of Object.keys(this.props.highlightedSquares)) {
      const { x, y } = this._algebraicToCartesian(square);
      const key = `${x},${y}`;
      colorMap[key] = this.props.highlightedSquares[square];
    }

    return (
      <Grid
        rows={this.props.rows}
        cols={this.props.cols}
        style={this.props.style}
        onClick={this._onClick}
        colorMap={colorMap}
      >
        {tokens}
      </Grid>
    );
  }

  _algebraicToCartesian(square: string) {
    const regexp = /([A-Za-z])([0-9]+)/g;
    const match = regexp.exec(square);
    if (match == null) {
      throw Error('Invalid square provided: ' + square);
    }
    const colSymbol = match[1].toLowerCase();
    const col = colSymbol.charCodeAt(0) - 'a'.charCodeAt(0);
    const row = parseInt(match[2], 10);
    if (this.props.invert) {
      return { x: this.props.cols - col - 1, y: row - 1 };
    } else {
      return { x: col, y: this.props.rows - row };
    }
  }

  _cartesianToAlgebraic(x: number, y: number) {
    if (this.props.invert) {
      const colSymbol = String.fromCharCode(
        (this.props.cols - x - 1) + 'a'.charCodeAt(0));
      return colSymbol + (y + 1);
    } else {
      const colSymbol = String.fromCharCode(x + 'a'.charCodeAt(0));
      return colSymbol + (this.props.rows - y);
    }
  }
}
