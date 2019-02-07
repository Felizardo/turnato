import * as React from 'react';
import FreeBoardGameBar from '../App/FreeBoardGameBar';
import Button from '@material-ui/core/Button';
import { Card, CardText, CardMedia, CardTitle } from 'material-ui/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

class About extends React.Component<{}, {}> {
  render() {
    return (
      <FreeBoardGameBar>
        <Card style={{ marginTop: '16px' }}>
          <CardTitle title="About FreeBoardGame.org" />
          <CardText>
            FreeBoardGame.org is a free (as in freedom), mobile-first, board game platform.
            Its goal is to popularize board games and to make them easy to play with friends, even from afar.
          </CardText>
        </Card>
        <Card style={{ marginTop: '16px' }}>
          <CardTitle title="Contributors" />
          <List>
            <ListItem>
              <ListItemText
                primary="flamecoals"
              />
              <Button size="small" color="primary" href="https://github.com/flamecoals">
                GitHub
              </Button>
            </ListItem>
            <ListItem>
              <ListItemText
                primary="JasonHarrison"
              />
              <Button size="small" color="primary" href="https://www.jasonharrison.us/?from=freeboardgame.org">
                Website
              </Button>
              <Button size="small" color="primary" href="https://github.com/jasonharrison">
                GitHub
              </Button>
            </ListItem>
          </List>
        </Card>
        <Card style={{ marginTop: '16px' }}>
          <CardTitle title="Credits" />
          <List>
            <ListItem>
              <ListItemText
                primary="Seabattle miss sound by InspectorJ"
              />
              <Button size="small" color="primary" href="https://freesound.org/people/InspectorJ/sounds/352103/">
                freesound.org
              </Button>
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Seabattle hit sound by fridobeck"
              />
              <Button size="small" color="primary" href="https://freesound.org/people/fridobeck/sounds/191694/">
                freesound.org
              </Button>
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Blox font (used in logo) by Brian Kent"
              />
              <Button size="small" color="primary" href="https://www.dafont.com/blox.font">
                dafont.com
              </Button>
            </ListItem>
          </List>
        </Card>
      </FreeBoardGameBar>
    );
  }
}

export default About;
