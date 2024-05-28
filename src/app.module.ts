import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { CreateGameController } from './controllers/create-games-controller'
import { CreateBetVariationController } from './controllers/create-betVariation-controler'

@Module({
  controllers: [CreateGameController, CreateBetVariationController],
  providers: [PrismaService],
})
export class AppModule {}
