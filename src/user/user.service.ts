import { BadRequestException, Injectable } from '@nestjs/common';
import { messages } from 'src/common/response/message.model';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findById(userId: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        active: true,
      },
      select: {
        first_name: true,
        last_name: true,
        email: true,
      },
    });

    if (!user) throw new BadRequestException(messages.user.notExists);

    return user;
  }
}
