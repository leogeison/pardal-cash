import { BadRequestException, Controller, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('betVariation')
export class CreateBetVariationController {
  constructor(private prisma: PrismaService) {}

  

  // Método para gerar uma combinação aleatória de números
  generateCombination(numbers: Set<number>, currentTotal: number): number[] {
    const combination: number[] = [];

    while (combination.length < 3) {
      const number = Math.floor(Math.random() * currentTotal) + 1;
      if (!combination.includes(number)) {
        combination.push(number);
        numbers.add(number);
      }
    }
    return combination;
  }

  // Método para criar combinações de número
  async createCombination(): Promise<void> {
    try {
      
      const currentTotal = 80;
      const numbers = new Set<number>();
      const combinations = new Set<string>();

      // Gerar todas as combinações possiveis
      while (combinations.size < (80 * 79 * 78) / (3 * 2 * 1)) {
        const newCombination = this.generateCombination(numbers, currentTotal);
        newCombination.sort((a, b) => a - b);

        const combinationKey = newCombination.join(',');
        if (!combinations.has(combinationKey)) {
          combinations.add(combinationKey);
        }
      }

      // Mapear as combinações para o formato adequado e inserir no banco de dados
      const data = Array.from(combinations).map(combination => ({
        numbers: combination.split(',').map(Number)
      }));

      await this.prisma.betVariation.createMany({
        data,
        skipDuplicates: true
      });

      console.log('Combinações inseridas com sucesso.');
    } catch (error) {
      console.error('Erro ao inserir combinações:', error);
      throw new BadRequestException('Falha ao inserir combinações.');
    }
  }

  // Rota para criar uma nova combinação de aposta
  @Post()
  async createBetVariation() {
    try {
      await this.createCombination();

      return { message: 'Combinações de apostas criadas com sucesso' };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Erro ao criar combinação de aposta');
    }
  }
}
