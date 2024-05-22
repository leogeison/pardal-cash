import { Controller } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
@Controller('/betVariations')
export class CreatebetVariationsController {
  constructor(private prisma: PrismaService) {}
}
