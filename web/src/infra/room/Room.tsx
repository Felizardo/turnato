import React from 'react';
import MessagePage from 'infra/common/components/alert/MessagePageClass';
import { LobbyService } from 'infra/common/services/LobbyService';
import { GAMES_MAP } from 'games';
import AlertLayer from 'infra/common/components/alert/AlertLayer';
import FreeBoardGamesBar from 'infra/common/components/base/FreeBoardGamesBar';
import { GameSharing } from 'infra/room/GameSharing';
import { ListPlayers } from 'infra/room/ListPlayers';
import { GameCard } from 'infra/common/components/game/GameCard';
import { NicknamePrompt } from 'infra/common/components/auth/NicknamePrompt';
import { useRouter, NextRouter } from 'next/router';
import Button from '@material-ui/core/Button';
import ReplayIcon from '@material-ui/icons/Replay';
import NicknameRequired from 'infra/common/components/auth/NicknameRequired';
import { StartMatchButton } from './StartMatchButton';
import { ReduxUserState } from 'infra/common/redux/definitions';
import { connect } from 'react-redux';
import { JoinRoom_joinRoom, JoinRoom_joinRoom_userMemberships } from 'gqlTypes/JoinRoom';
import { Dispatch } from 'redux';
import Router from 'next/router';
import { Subscription } from '@apollo/react-components';
import { gql } from 'apollo-boost';
import CircularProgress from '@material-ui/core/CircularProgress';

export const ROOM_SUBSCRIPTION = gql`
  subscription RoomMutated($roomId: String!, $jwt: String) {
    roomMutated(roomId: $roomId, jwt: $jwt) {
      gameCode
      capacity
      isPublic
      matchId
      userId
      userMemberships {
        isCreator
        user {
          id
          nickname
        }
      }
    }
  }
`;

interface Props {
  gameCode: string;
  router: NextRouter;
  user: ReduxUserState;
  dispatch: Dispatch;
}

interface State {
  roomMetadata?: JoinRoom_joinRoom;
  nameTextField?: string;
  userId?: number;
  loading: boolean;
  partialLoading: boolean;
  error: string;
  editingName: boolean;
  removedFromRoom: boolean;
}

class Room extends React.Component<Props, State> {
  state: State = {
    error: '',
    loading: true,
    partialLoading: false,
    editingName: false,
    removedFromRoom: false,
  };

  componentDidMount() {
    this.joinRoom();
  }

  render() {
    if (this.state.error) {
      const TryAgain = (
        <Button variant="outlined" style={{ margin: '8px' }} onClick={this._tryAgain}>
          <ReplayIcon style={{ marginRight: '8px' }} />
          Try Again
        </Button>
      );
      return <MessagePage type={'error'} message={this.state.error} actionComponent={TryAgain} />;
    }
    if (this.state.removedFromRoom) {
      return <MessagePage type={'error'} message={'You were removed from the room.'} />;
    }
    if (this.state.loading) {
      return <MessagePage type={'loading'} message={'Loading...'} />;
    }
    const gameDef = GAMES_MAP[this.state.roomMetadata.gameCode];
    return (
      <FreeBoardGamesBar>
        {this.getNicknamePrompt()}
        <GameCard game={gameDef} />
        {this._getGameSharing()}
        <Subscription
          subscription={ROOM_SUBSCRIPTION}
          variables={{ roomId: this._roomId(), jwt: LobbyService.getUserToken() }}
        >
          {(resp) => {
            if (this.state.partialLoading) {
              return <CircularProgress style={{ paddingTop: '16px' }} />;
            }
            const room = resp.data?.roomMutated || this.state.roomMetadata;
            if (room.matchId) {
              this.redirectToMatch(room.matchId);
            }
            const currentUserInMetadata = room.userMemberships.find(
              (membership: JoinRoom_joinRoom_userMemberships) => membership.user.id === this.state.userId,
            );
            if (!currentUserInMetadata) {
              this.setState({ removedFromRoom: true });
            }
            return (
              <React.Fragment>
                <ListPlayers
                  roomMetadata={room}
                  editNickname={this._toggleEditingName}
                  removeUser={this._removeUser}
                  userId={this.state.userId}
                />
                {this.renderLeaveRoomButton()}
                <StartMatchButton roomMetadata={room} userId={this.state.userId} startMatch={this._startMatch} />
              </React.Fragment>
            );
          }}
        </Subscription>
      </FreeBoardGamesBar>
    );
  }

  redirectToMatch(matchId: string) {
    Router.replace(`/match/${matchId}`);
  }

  joinRoom = () => {
    LobbyService.joinRoom(this.props.dispatch, this._roomId()).then(
      async (response) => {
        const roomMetadata = response.joinRoom;
        if (roomMetadata.matchId) {
          this.redirectToMatch(response.joinRoom.matchId);
        } else {
          this.setState({ loading: false, roomMetadata: roomMetadata, userId: roomMetadata.userId });
        }
      },
      () => {
        this.setState({ error: 'Failed to fetch room metadata.' });
      },
    );
  };

  renderLeaveRoomButton() {
    return (
      <Button variant="outlined" onClick={this._leaveRoom}>
        Leave room
      </Button>
    );
  }
  getNicknamePrompt() {
    if (!this.state.editingName) {
      return;
    }
    return (
      <AlertLayer>
        <NicknamePrompt
          setNickname={this._setNickname}
          nickname={this.props.user.nickname}
          closePrompt={this._toggleEditingName}
        />
      </AlertLayer>
    );
  }

  _toggleEditingName = () => {
    this.setState({ editingName: !this.state.editingName });
  };

  _leaveRoom = () => {
    const dispatch = (this.props as any).dispatch;
    LobbyService.leaveRoom(dispatch, this._roomId());
    // FIXME: on dev only, this does not work for a redirect to '/'.
    // However, it works for other routes such as '/about' ... why?
    Router.push('/');
  };

  _removeUser = (userIdToBeRemoved: number) => () => {
    const dispatch = (this.props as any).dispatch;
    LobbyService.removeUser(dispatch, userIdToBeRemoved, this._roomId());
  };

  _setNickname = (nickname: string) => {
    this.setState({ loading: true });
    const dispatch = (this.props as any).dispatch;
    LobbyService.renameUser(dispatch, nickname).then(
      () => {
        this.joinRoom();
      },
      () => {
        this.setState({ error: 'Failed to set nickname.' });
      },
    );
    this._toggleEditingName();
  };

  _getGameSharing = () => {
    const gameCode = this.props.router.query.gameCode as string;
    return <GameSharing gameCode={gameCode} roomID={this._roomId()} isPublic={this.state.roomMetadata.isPublic} />;
  };

  _roomId() {
    return this.props.router.query.roomID as string;
  }

  _startMatch = () => {
    this.setState({ partialLoading: true });
    LobbyService.startMatch(this.props.dispatch, this._roomId()).then(
      (matchId) => {
        this.redirectToMatch(matchId);
      },
      () => {
        this.setState({ partialLoading: false, error: 'Failed to start match' });
      },
    );
  };

  _tryAgain = () => {
    this.setState((oldState) => ({ ...oldState, error: '' }));
    this.joinRoom();
  };
}

const roomWithRouter = (props) => {
  const router = useRouter();
  return (
    <NicknameRequired>
      <Room {...props} router={router} />
    </NicknameRequired>
  );
};

/* istanbul ignore next */
const mapStateToProps = function (state) {
  return {
    user: { ...state.user },
  };
};

export default connect(mapStateToProps)(roomWithRouter);
