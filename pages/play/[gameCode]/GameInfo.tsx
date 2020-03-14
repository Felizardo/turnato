import React from 'react';
import FreeBoardGamesBar from 'components/App/FreeBoardGamesBar';
import { GameCard } from 'components/App/Game/GameCard';
import { GameModePicker } from 'components/App/Game/GameModePicker';
import { GameInstructionsVideo } from 'components/App/Game/GameInstructionsVideo';
import { IGameDef, GAMES_MAP } from 'games';
import { withRouter } from 'next/router';
import { generatePageError } from 'next-with-error';
import SEO from 'components/SEO';
import { DesktopView, MobileView } from 'components/DesktopMobileView';
import { Typography, Card } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';
import { GameInstructionsText } from 'components/App/Game/GameInstructionsText';
import Breadcrumbs from 'components/Breadcrumbs';

interface gameInfoProps {
  gameDef: IGameDef;
  asPath: string;
  userAgent?: string;
}

const DESKTOP_MOBILE_THRESHOLD = 768;

class GameInfo extends React.Component<gameInfoProps, {}> {
  render() {
    const gameDef = this.props.gameDef;
    return (
      <FreeBoardGamesBar FEATURE_FLAG_readyForDesktopView>
        <SEO title={`Play ${gameDef.name}, ${gameDef.description}`} description={gameDef.descriptionTag} />
        <Breadcrumbs
          itemListElements={[
            {
              position: 1,
              name: 'Play',
              item: '/play',
            },
            {
              position: 2,
              name: gameDef.name,
              item: this.props.asPath,
            },
          ]}
        />
        <DesktopView userAgent={this.props.userAgent} thresholdWidth={DESKTOP_MOBILE_THRESHOLD}>
          <div style={{ padding: '0 8px', display: 'inline-flex' }}>
            <span style={{ marginTop: '18px', minWidth: '500px' }}>
              <GameCard game={gameDef} />
            </span>
            <span style={{ marginTop: '18px' }}>
              <Card style={{ maxHeight: '250px', overflowY: 'auto' }}>
                <Typography style={{ marginLeft: '16px' }} variant="body2" component="div">
                  <ReactMarkdown linkTarget="_blank" source={gameDef.instructions.text} />
                </Typography>
              </Card>
            </span>
          </div>
          <GameModePicker gameDef={gameDef} />
          <GameInstructionsVideo gameDef={gameDef} />
        </DesktopView>
        <MobileView userAgent={this.props.userAgent} thresholdWidth={DESKTOP_MOBILE_THRESHOLD}>
          <GameCard game={gameDef} NO_MAX_WIDTH />
          <GameModePicker gameDef={gameDef} />
          <GameInstructionsVideo gameDef={gameDef} />
          <GameInstructionsText gameDef={gameDef} />
        </MobileView>
      </FreeBoardGamesBar>
    );
  }
  static async getInitialProps({ res, query, asPath }) {
    const gameCode = query.gameCode as string;
    const gameDef: IGameDef = GAMES_MAP[gameCode];
    if (!gameDef && res) {
      return generatePageError(404);
    }
    return { gameDef, asPath };
  }
}

export default withRouter(GameInfo as any);
