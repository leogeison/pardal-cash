import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipes'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const createPlayerBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  email: z.string().email(),
  birthDate: z.string(), // validar string
})

type CreatePlayerBodySchema = z.infer<typeof createPlayerBodySchema>

@Controller('players')
export class PlayersController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createPlayerBodySchema))
  async createPlayer(@Body() body: CreatePlayerBodySchema) {
    try {
      const { name, cpf, email, birthDate } = body

      const playerWithSameEmail = await this.prisma.player.findUnique({
        where: {
          email,
        },
      })

      const playerWithSameCpf = await this.prisma.player.findUnique({
        where: {
          cpf,
        },
      })

      if (playerWithSameEmail) {
        throw new ConflictException('já existe um jogador com mesmo email')
      }

      if (playerWithSameCpf) {
        throw new ConflictException('já existe um jogador com mesmo cpf')
      }

      await this.prisma.player.create({
        data: {
          name,
          cpf,
          email,
          birthDate: new Date(birthDate).toISOString(),
        },
      })
      return { message: 'Jogador criado com sucesso' }
    } catch (error) {
      console.error(error)
      if (error instanceof ConflictException) {
        throw error
      } else {
        throw new BadRequestException('Falha ao criar o jogador')
      }
    }
  }

  @Get()
  async getAllPlayers() {
    try {
      return await this.prisma.player.findMany()
    } catch (error) {
      throw new BadRequestException(
        'Falha ao recuperar os Jogadores do banco de dados',
      )
    }
  }

  @Get(':id')
  async getPlayerById(@Param('id', ParseIntPipe) id: number) {
    try {
      const player = await this.prisma.player.findUnique({
        where: {
          id,
        },
      })

      if (!player) {
        throw new NotFoundException('Jogador não encontrado')
      }

      return player
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new BadRequestException('Falha ao buscar o jogador pelo ID')
      }
    }
  }

  @Delete(':id')
  async deletePlayerById(@Param('id', ParseIntPipe) id: number) {
    try {
      const player = await this.prisma.player.findUnique({
        where: {
          id,
        },
      })

      if (!player) {
        throw new NotFoundException('Jogador não encontrado')
      }

      await this.prisma.player.delete({
        where: {
          id,
        },
      })

      return { message: 'Jogador deletado com sucesso' }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new BadRequestException('Falha ao deletar o jogador')
      }
    }
  }
}
