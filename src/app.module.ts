import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { CreateGameController } from './controllers/create-games-controller'
import { CreateBetVariationController } from './controllers/create-betVariation-controller'
import { PlayersController } from './controllers/create-players-controller'
import { TicketController } from './controllers/create-ticket-controller'

@Module({
  controllers: [
    CreateGameController,
    CreateBetVariationController,
    PlayersController,
    TicketController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
