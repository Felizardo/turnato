import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Battle } from './Battle';
import { SeabattleGame } from './game';
import { VALID_SETUP_FIRST_PLAYER, VALID_SETUP_SECOND_PLAYER } from './mocks';
import { Client } from 'boardgame.io/client';

// mock functions for HTMLMediaElement
// https://github.com/jsdom/jsdom/issues/2155#issuecomment-366703395
(window as any).HTMLMediaElement.prototype.load = () => {
  /* do nothing */
};
(window as any).HTMLMediaElement.prototype.play = () => {
  /* do nothing */
};
(window as any).HTMLMediaElement.prototype.pause = () => {
  /* do nothing */
};
(window as any).HTMLMediaElement.prototype.addTextTrack = () => {
  /* do nothing */
};

Enzyme.configure({ adapter: new Adapter() });

test('one phase - hit', () => {
  const client = Client({
    game: SeabattleGame,
  });
  const store = client.store;
  client.moves.setShips(VALID_SETUP_FIRST_PLAYER);
  client.updatePlayerID('1');
  client.moves.setShips(VALID_SETUP_SECOND_PLAYER);

  client.moves.salvo(0, 0);
  client.updatePlayerID('0');
  client.moves.salvo(1, 1);
  client.updatePlayerID('1');

  const grid = Enzyme.mount(
    <Battle
      ctx={store.getState().ctx}
      G={store.getState().G}
      moves={client.moves}
      playerID={'1'}
      currentPlayer={store.getState().ctx.currentPlayer}
      getSoundPref={jest.fn(() => true)}
    />,
  );
  // should be ignored
  grid.find({ x: 0, y: 0 }).find('Square').at(0).simulate('click');
  grid.find({ x: 0, y: 9 }).find('Square').at(0).simulate('click');
  expect(grid.html()).toContain('CLICK TO SHOOT');

  grid.setProps({
    ...grid.props(),
    G: store.getState().G,
    currentPlayer: store.getState().ctx.currentPlayer,
  });
  expect(grid.html()).toContain('HIT');

  // End Animation...
  (grid.instance() as Battle)._animate(grid.state('startTime'))();
  (grid.instance() as Battle)._animate((grid.state('startTime') as number) + 1e4)();

  expect(grid.html()).toContain('Waiting for opponent...');
});

test('one phase - miss', () => {
  const client = Client({
    game: SeabattleGame,
  });
  const store = client.store;
  client.moves.setShips(VALID_SETUP_FIRST_PLAYER);
  client.updatePlayerID('1');
  client.moves.setShips(VALID_SETUP_SECOND_PLAYER);

  client.moves.salvo(9, 9);

  const grid = Enzyme.mount(
    <Battle
      ctx={store.getState().ctx}
      G={store.getState().G}
      moves={client.moves}
      playerID={'1'}
      currentPlayer={store.getState().ctx.currentPlayer}
      getSoundPref={jest.fn(() => true)}
    />,
  );
  grid.setState({
    ...grid.state(),
    startTime: Date.now(),
    salvo: { hit: false },
    showSalvo: true,
  });
  expect(grid.html()).toContain('MISS');
});
