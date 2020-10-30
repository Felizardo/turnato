import * as React from 'react';

import css from './PlayerZone.css';
import { PlayerStack } from './PlayerStack';
import { PlayerRevealedStack } from './PlayerRevealedStack';
import { CardType } from './cardType';
<<<<<<< HEAD
import { MaxPlayers } from './game';
import { CardStyle } from './CardComponent';

export enum PlayerStatus {
  CurrentPlayer,
  HasWin,
  Skipped,
  HasBet,
  HasMaxBet,
}

export interface IPlayerZoneProps {
  playerStatuses: PlayerStatus[];
  bet: number | null;
  totalPlayerCards: number;
  stackSize: number;
  revealedStack: CardType[];
  playerId: string;
  playerCardStyle: CardStyle;
  revealCard?: (playerId: string) => void;
  totalPlayers: number;
  positionIndex: number;
=======

export interface IPlayerZoneProps {
  stackSize: number;
  revealedStack: CardType[];
  playerIndex: number;
  revealCard?: (playerIndex: number) => void;
>>>>>>> upstream/master
}

export class PlayerZone extends React.Component<IPlayerZoneProps, {}> {
  render() {
<<<<<<< HEAD
    var radius = this.getRadiusForPlayers(this.props.totalPlayers);

    var angle = (2 * Math.PI * this.props.positionIndex) / this.props.totalPlayers;
    var top = Math.cos(angle) * radius;
    var left = -Math.sin(angle) * radius;

    return (
      <div
        className={css.playerZone}
        style={{ position: 'absolute', top: top, left: left, transform: `translate(-50%, -50%) rotate(${angle}rad)` }}
      >
        <div className={css.statuses}>{this.renderStatuses()}</div>
=======
    return (
      <div className={css.playerZone}>
>>>>>>> upstream/master
        <div className={css.stack}>{this.renderStack()}</div>
        <div className={css.revealedStack}>{this.renderRevealedStack()}</div>
      </div>
    );
  }

<<<<<<< HEAD
  renderStatuses() {
    return this.props.playerStatuses.map((s, i) => this.renderStatus(s, i));
  }

  renderStatus(status: PlayerStatus, index: number) {
    switch (status) {
      case PlayerStatus.CurrentPlayer:
        return <span key={index}>🕒</span>;

      case PlayerStatus.HasWin:
        return <span key={index}>🔥</span>;

      case PlayerStatus.Skipped:
        return <span key={index}>❌</span>;

      case PlayerStatus.HasBet:
        return <span key={index}>✋</span>;

      case PlayerStatus.HasMaxBet:
        return <span key={index}>😰</span>;
    }

    return null;
  }

=======
>>>>>>> upstream/master
  renderStack() {
    return (
      <PlayerStack
        revealCard={this.props.revealCard}
<<<<<<< HEAD
        playerId={this.props.playerId}
        stackSize={this.props.stackSize}
        cardStyle={this.props.playerCardStyle}
=======
        playerIndex={this.props.playerIndex}
        stackSize={this.props.stackSize}
>>>>>>> upstream/master
      ></PlayerStack>
    );
  }

  renderRevealedStack() {
    return <PlayerRevealedStack stack={this.props.revealedStack}></PlayerRevealedStack>;
  }
<<<<<<< HEAD

  getRadiusForPlayers(totalPlayers: number): number {
    var minRadius = 25;
    var maxRadius = 200;

    return minRadius + ((maxRadius - minRadius) * totalPlayers) / MaxPlayers;
  }
=======
>>>>>>> upstream/master
}
