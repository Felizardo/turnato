// import `fetch` to fix apollo-link-http-common's Invariant Violation:
// fetch is not found globally and no fetcher passed, to fix pass a fetch for
// your environment like https://www.npmjs.com/package/node-fetch.
(global as any).fetch = require('node-fetch');
import { GAMES_LIST } from 'games';
import noCache from 'koa-no-cache';
const cors = require('@koa/cors'); // tslint:disable-line
const redis = require('redis');
const redisAdapter = require('socket.io-redis');
import { Server, SocketIO } from 'boardgame.io/server';
import { PostgresStore } from 'bgio-postgres';

const PORT = parseInt(process.env.BGIO_PORT || '8001', 10);

function getDb() {
  const pgUrl = process.env.POSTGRES_URL;
  if (!pgUrl) {
    return;
  }
  return new PostgresStore(pgUrl);
}

function getTransport() {
  const host = process.env.FBG_REDIS_HOST;
  const port = process.env.FBG_REDIS_PORT;
  const password = process.env.FBG_REDIS_PASSWORD;
  if (!host || !port || !password) {
    return;
  }
  const pub = redis.createClient(port, host, { auth_pass: password });
  const sub = redis.createClient(port, host, { auth_pass: password });
  return new SocketIO({ socketAdapter: redisAdapter({ pubClient: pub, subClient: sub }) });
}

const startServer = async () => {
  const configs = Promise.all(GAMES_LIST.map((gameDef) => gameDef.config()));
  const games = (await configs).map((config) => config.default.bgioGame);
  const server = Server({ games, db: getDb(), transport: getTransport() });
  server.app.use(noCache({ global: true }));
  server.app.use(cors());
  server.run(PORT, () => {
    // eslint-disable-next-line
    console.log(`Serving boardgame.io at: http://0.0.0.0:${PORT}/`); // tslint:disable-line
  });
};

startServer();
