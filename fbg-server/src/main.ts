import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // FIXME do we need this or anything comparable for gql?
  // app.use(cookieParser());
  // app.use(csurf({ cookie: true }));

  await app.listen(3001);
}
bootstrap();
