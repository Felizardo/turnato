import { MatchEntity } from './db/Match.entity';
import { Match } from '../dto/match/Match';
import { userEntityToUser } from '../users/UserUtil';

export function matchEntityToMatch(entity: MatchEntity, userId: number): Match {
  const memberships = [...entity.playerMemberships];
  memberships.sort((a, b) => a.bgioPlayerId - b.bgioPlayerId);
  const match: Match = {
    gameCode: entity.gameCode,
    bgioServerUrl: entity.bgioServerExternalUrl,
    bgioMatchId: entity.bgioMatchId,
    players: memberships.map((membership) => userEntityToUser(membership.user)),
  };
  const userMembership = entity.playerMemberships.find(
    (membership) => membership.user.id === userId,
  );
  if (userMembership) {
    match.bgioSecret = userMembership.bgioSecret;
    match.bgioPlayerId = `${userMembership.bgioPlayerId}`;
  }
  return match;
}

export interface BgioServers {
  internal: string;
  external: string;
}

export function getBgioServerUrl(): BgioServers {
  const internalServers =
    process.env.BGIO_PRIVATE_SERVERS || 'http://localhost:8001';
  const externalServers =
    process.env.BGIO_PUBLIC_SERVERS || 'http://localhost:8001';
  const possibleInternalServers = internalServers.split(',');
  const possibleExternalervers = externalServers.split(',');

  // https://stackoverflow.com/questions/5915096/get-random-item-from-javascript-array
  const pos = Math.floor(Math.random() * possibleInternalServers.length);
  return {
    internal: possibleInternalServers[pos],
    external: possibleExternalervers[pos],
  };
}
