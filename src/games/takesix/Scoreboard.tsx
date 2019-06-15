import * as React from 'react';
import { IScore } from './game';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import grey from '@material-ui/core/colors/grey';
import { IPlayerInRoom } from '../../App/Lobby/LobbyService';

interface IScoreboardProps {
  scoreboard: IScore[];
  players: IPlayerInRoom[];
  playerID: string;
}

export class Scoreboard extends React.Component<IScoreboardProps, {}> {
  render() {
    return (
      <div className="scoreboard">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Player</TableCell>
              <TableCell>Penalty points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.scoreboard.map((score, i) => {
              let style = {};
              if (score.playerID.toString() === this.props.playerID) {
                style = {
                  background: grey[200],
                };
              }
              const name = this.props.players.find(player => player.playerID === score.playerID).name;
              return (
                <TableRow key={score.playerID} style={style}>
                  <TableCell>#{i + 1}</TableCell>
                  <TableCell>{name}</TableCell>
                  <TableCell>{score.penaltyPoints}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
}
