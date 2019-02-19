import React from 'react';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import AndroidIcon from '@material-ui/icons/Android';
import GroupIcon from '@material-ui/icons/Group';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import shortid from 'shortid';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

interface IGameModePickerProps {
  gameCode: string;
  modes: GameMode[];
}

export enum GameMode {
  EasyAI = 'easyAI',
  MediumAI = 'mediumAI',
  HardAI = 'hardAI',
  OnlineFriend = 'online',
  LocalFriend = 'local',
}

export class GameModePicker extends React.Component<IGameModePickerProps, {}> {
  _getLink = (to: string) => (props: any) => {
    return React.createElement(Link, { ...props, to }, props.children);
  }

  render() {
    const modes = [];
    for (const mode of this.props.modes) {
      modes.push(this._getListItem(mode));
    }
    return (
      <List>
        <ListSubheader>Choose game mode</ListSubheader>
        {modes}
      </List>
    );
  }

  _getListItem(mode: GameMode) {
    let text = '';
    let icon = <AndroidIcon />;
    switch (mode) {
      case GameMode.EasyAI:
        text = 'Easy AI';
        icon = <AndroidIcon />;
        break;
      case GameMode.MediumAI:
        text = 'Medium AI';
        icon = <AndroidIcon />;
        break;
      case GameMode.HardAI:
        text = 'Hard AI';
        icon = <AndroidIcon />;
        break;
      case GameMode.LocalFriend:
        text = 'Local Friend';
        icon = <GroupIcon />;
        break;
      case GameMode.OnlineFriend:
        text = 'Online Friend';
        icon = <GroupIcon />;
        break;
    }
    return (
      <ListItem
        button={true}
        component={this._getLink(this._getUrl(mode))}
        key={text}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText>{text}</ListItemText>
      </ListItem>);
  }

  _getUrl(mode: GameMode) {
    const uid = shortid.generate();
    switch (mode) {
      case GameMode.EasyAI:
        return `/g/${this.props.gameCode}/easyAI`;
      case GameMode.MediumAI:
        return `/g/${this.props.gameCode}/mediumAI`;
      case GameMode.HardAI:
        return `/g/${this.props.gameCode}/hardAI`;
      case GameMode.LocalFriend:
        return `/g/${this.props.gameCode}/local`;
      case GameMode.OnlineFriend:
        return `/g/${this.props.gameCode}/online/${uid}/0`;
    }
  }
}
