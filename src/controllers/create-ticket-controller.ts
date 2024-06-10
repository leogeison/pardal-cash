import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipes'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const createTicketBodySchema = z.object({
  gameId: z.number().positive(),
  playerId: z.number().positive(),
})

type CreateTicketBodySchema = z.infer<typeof createTicketBodySchema>

@Controller('ticket')
export class TicketController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createTicketBodySchema))
  async createTicket(@Body() body: CreateTicketBodySchema) {
    try {
      const { gameId, playerId } = body

      // checar se jogo existe
      const game = await this.prisma.game.findUnique({
        where: { id: gameId },
      })

      if (!game) {
        throw new BadRequestException('Jogo não encontrado')
      }

      // checar se jogador existe e se é maior de 17 anos
      const player = await this.prisma.player.findUnique({
        where: { id: playerId },
      })

      if (!player) {
        throw new BadRequestException('Jogador não encontrado')
      }

      const currentDate = new Date()
      const birthDate = new Date(player.birthDate)
      const age = currentDate.getFullYear() - birthDate.getFullYear()

      if (age < 18) {
        throw new BadRequestException('Jogador deve ser maior de 17 anos.')
      }

      // Busca todas as variações de apostas
      const betVariations = await this.prisma.betVariation.findMany()

      const totalBets = betVariations.length
      const betsPerTicket = 22

      if (totalBets < betsPerTicket) {
        throw new BadRequestException(
          'Número insuficiente de variações de apostas para criar um bilhete.',
        )
      }

      // Seleciona 22 variações de aposta aleartoria
      const shuffledBets = betVariations.sort(() => 0.5 - Math.random())
      const ticketBets = shuffledBets
        .slice(0, betsPerTicket)
        .map((bv) => bv.numbers)

      const ticket = {
        gameId,
        playerId,
        purchaseDate: new Date(),
        bets: ticketBets,
      }

      /*  Antes de Criar o bilhete precisa fazer validação se existe algum bilhete do mesmo playerId num Game com as mesmas variações de apostas */

      // Cria o bilhete
      await this.prisma.ticket.create({ data: ticket })

      console.log('Bilhete criado com sucesso.')
      return { message: 'Bilhete criado com sucesso.' }
    } catch (error) {
      console.error('Erro ao criar bilhete:', error)
      throw new BadRequestException('Falha ao criar bilhete.')
    }
  }
}
