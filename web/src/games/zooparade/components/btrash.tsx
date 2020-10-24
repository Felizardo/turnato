import React from 'react';
import { ICard } from '../interfaces';
import { BCard } from './bcard';

interface InnerWrapper {
  card: ICard;
}

export class BTrash extends React.Component<InnerWrapper, {}> {
  render() {
    return (
      <div>
        <BCard card={this.props.card} empty={this.props.card ? null : -1} />
      </div>
    );
  }
}
