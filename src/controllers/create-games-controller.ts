import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipes'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const createGameBodySchema = z.object({
  drawDate: z.string(), // validar string
  /* drawNumbers: z.array(z.number()), */
})

type CreateGameBodySchema = z.infer<typeof createGameBodySchema>

@Controller('games')
export class CreateGameController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createGameBodySchema))
  async createGame(@Body() body: CreateGameBodySchema) {
    try {
      const { drawDate /* , drawNumbers */ } = body
      const game = await this.prisma.game.create({
        data: {
          drawDate: new Date(drawDate).toISOString().split('t')[0], // salvar apenas data
          /* drawnNumbers: drawNumbers, */
        },
      })
      return { game, message: 'Jogo criado com sucesso' }
    } catch (error) {
      console.error(error)
      throw new BadRequestException('Falha ao criar o jogo')
    }
  }

  @Get()
  async getAllGames() {
    try {
      return await this.prisma.game.findMany()
    } catch (error) {
      throw new BadRequestException(
        'Falha ao recuperar os jogos do banco de dados',
      )
    }
  }
}
