import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchEntity } from './db/Match.entity';
import { MatchMembershipEntity } from './db/MatchMembership.entity';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { RoomsModule } from '../rooms/rooms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatchEntity, MatchMembershipEntity]),
    RoomsModule,
    HttpModule,
  ],
  providers: [MatchService],
  controllers: [MatchController],
})
export class MatchModule {}
