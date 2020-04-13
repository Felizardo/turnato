import React from 'react';
import Enzyme from 'enzyme';

import { ScoreBadges } from './ScoreBadges';
import { IScore } from './Scoreboard';
import { IPlayerInRoom } from 'components/App/Lobby/LobbyService';

const scoreBoard: IScore[] = [
  { playerID: '0', score: 5 },
  { playerID: '1', score: 10 },
];

const players: IPlayerInRoom[] = [
  { playerID: 0, roomID: 'fooroom', name: 'Foo' },
  { playerID: 1, roomID: 'fooroom', name: 'Bar' },
];

let comp: Enzyme.ReactWrapper;

beforeEach(() => {
  const fakeCtx: any = { currentPlayer: '0', activePlayers: null };
  comp = Enzyme.mount(<ScoreBadges scoreboard={scoreBoard} playerID={'0'} players={players} ctx={fakeCtx} />);
});

it("has player 0's name", () => {
  const name = comp.find('[data-testid="nickname-0"]').at(0);
  expect(name.text()).toContain('Foo');
});

it("has player 0's score", () => {
  const name = comp.find('[data-testid="score-0"]').at(0);
  expect(name.text()).toEqual('5');
});

it("has player 1's name", () => {
  const name = comp.find('[data-testid="nickname-1"]').at(0).text();
  expect(name).toEqual('Bar');
});

it("has player 1's score", () => {
  const name = comp.find('[data-testid="score-1"]').at(0).text();
  expect(name).toEqual('10');
});

it('shows my name in bold', () => {
  const name = comp.find('[data-testid="nickname-0"]').at(0);
  expect(name.hasClass('Self')).toBeTruthy();
});

it("does not show other player's name in bold", () => {
  const name = comp.find('[data-testid="nickname-1"]').at(0);
  expect(name.hasClass('Self')).not.toBeTruthy();
});

it('shows player with clock when it is their turn', () => {
  const name = comp.find('[data-testid="nickname-0"]').at(0).text();
  expect(name).toContain('🕒');
});

it('shows player with clock when it they are active', () => {
  comp.setProps({ ctx: { currentPlayer: '1', activePlayers: { '0': null } } });
  const name = comp.find('[data-testid="nickname-0"]').at(0).text();
  expect(name).toContain('🕒');
});

it('does not show the clock when it isnt their turn', () => {
  comp.setProps({ ctx: { currentPlayer: '1', activePlayers: null } });
  const name = comp.find('[data-testid="nickname-0"]').at(0).text();
  expect(name).not.toContain('🕒');
});

it('uses custom colors', () => {
  const colors = { '0': 'red' };
  comp.setProps({ colors });
  const name = comp.find('[data-testid="scorebadge-0"]').at(0);
  const borderColor = name.prop('style').borderColor;
  expect(borderColor).toEqual('red');
});
