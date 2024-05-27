import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const createGameBodySchema = z.object({
  drawDate: z.string().transform((str) => new Date(str)), // validar string e transformar em date
  drawNumbers: z.array(z.number()),
})

type createGameBodySchema = z.infer<typeof createGameBodySchema>

@Controller('/games')
export class CreateGameController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async createGame(@Body() body: createGameBodySchema) {
    try {
      const { success, error } = createGameBodySchema.safeParse(body)
      if (!success) {
        throw new BadRequestException(error.format())
      }
      const { drawDate, drawNumbers } = body
      const game = await this.prisma.game.create({
        data: {
          drawDate: new Date(drawDate),
          drawnNumbers: drawNumbers,
        },
      })
      return { game, message: 'Jogo criado com sucesso' }
    } catch (error) {
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
