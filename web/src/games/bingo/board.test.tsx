import Enzyme from 'enzyme';
import { Client } from 'boardgame.io/client';
import { BingoGame } from './game';
import { BingoBoard } from './board';
import { GameMode } from 'gamesShared/definitions/mode';
import { INITIAL_WAIT_REF_NUM, WILDCARD_NUM, MAX_BINGO_CALLS } from './constants';

let wrapper: Enzyme.ReactWrapper;
let client;
let state0: any;

const updateGameProps = () => {
  const state = client.store.getState();
  wrapper.setProps({ G: state.G, ctx: state.ctx, moves: client.moves });
};

describe('Bingo UI', () => {
    beforeEach(() => {
      client = Client({
        game: BingoGame,
      });
      state0 = client.store.getState();
      wrapper = Enzyme.mount(
        <BingoBoard
          G={state0.G}
          ctx={state0.ctx}
          moves={client.moves}
          playerID={'0'}
          isActive={true}
          gameArgs={{
            gameCode: 'bingo',
            mode: GameMode.OnlineFriend,
            players: [
              { playerID: 0, name: 'Player A' },
              { playerID: 1, name: 'Player B' },
            ],
          }}
        />,
      );
    });

    test('all numbers are being renders', () => {
        expect(wrapper.text()).toContain("Starting");
        for(let n of state0.G.players['0'].numbers){
            if(n.value !== INITIAL_WAIT_REF_NUM && n.value !== WILDCARD_NUM){
                expect(wrapper.text()).toContain(n.value.toString());
            }
        }
        expect(wrapper.text()).toContain("Table");
        expect(wrapper.text()).toContain("Bingo!");
    }); 

    test('bingo calls reduces stars', () => {
        wrapper.find(`[data-testid="bingo-shout-btn"]`).at(0).simulate('click');
        updateGameProps();
        expect(wrapper.text()).toContain("Bingo! ⭐⭐✰");
    }); 

    test('table shows played numbers', () => {
        const callRef = 5;
        wrapper.setProps({G: {...state0.G, callRef}});
        wrapper.find(`[data-testid="bingo-shout-btn"]`).at(0).simulate('click');
        wrapper.setState({showCallTable: true});
        for(let i = 1; i < callRef; i++){
            expect(wrapper.text()).toContain(state0.G.players['0'].numbers[i].value);
        }
        // the current value of call should not be shown
        expect(wrapper.text()).not.toContain(state0.G.players['0'].numbers[callRef].value);
    }); 

    test('used up bingo calls shows sorry message', () =>{
        for(let i = 0; i < MAX_BINGO_CALLS; i++){
            wrapper.find(`[data-testid="bingo-shout-btn"]`).at(0).simulate('click');
            updateGameProps();
        }
        expect(wrapper.text()).toContain('Sorry');
    });

    test('shows player 0 as lose', () => {
      wrapper.setProps({ctx: { gameover: { winner: '1' }, currentPlayer: '0' }});
      expect(wrapper.text()).toContain('Game Over, you lost (winner: Player B)!');
    });

    test('shows player 0 as the winner', () => {
        wrapper.setProps({ctx: { gameover: { winner: '0' }, currentPlayer: '0' }});
        expect(wrapper.text()).toContain('Game Over, you won!');
    });

    test('shows game draw', () => {
        wrapper.setProps({ctx: { gameover: { draw: true }, currentPlayer: '0' }});
        expect(wrapper.text()).toContain('Game Over, draw!');
    });

});