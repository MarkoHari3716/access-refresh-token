import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { messages } from 'src/common/response/message.model';
import { ResponseModel } from 'src/common/response/response.model';
import { AuthUtils } from 'src/common/utils';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, RegistrationDto } from './dto';
import { JwtPayload } from './type';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async login(dto: AuthDto) {
    const { email, password } = dto || {};

    const user = await this.prisma.user.findFirst({
      where: {
        email,
        password: AuthUtils.hashSha512(password),
        active: true,
      },
    });

    if (!user) throw new ForbiddenException(messages.user.wrongCredentials);

    const tokens = await this.getTokens(user);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashed_rt: {
          not: null,
        },
      },
      data: {
        hashed_rt: null,
      },
    });

    return new ResponseModel(HttpStatus.OK, messages.user.loggedOut);
  }

  async refreshTokens(user_id: number, refresh_token: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: user_id,
        active: true,
      },
    });

    if (!user || !user.hashed_rt)
      throw new ForbiddenException(messages.user.notAccess);

    const rtMatches = AuthUtils.verifySha512(refresh_token, user.hashed_rt);
    if (!rtMatches) throw new ForbiddenException(messages.user.notAccess);

    const tokens = await this.getTokens(user);
    await this.updateRtHash(user_id, tokens.refresh_token);

    return tokens;
  }

  async registration(dto: RegistrationDto) {
    const { first_name, last_name, email, password } = dto || {};

    // check unique email
    await this.checkIfEmailExists(email);

    await this.prisma.user.create({
      data: {
        first_name,
        last_name,
        email,
        password: AuthUtils.hashSha512(password),
      },
    });

    return new ResponseModel(HttpStatus.OK, messages.user.registration);
  }

  async updateRtHash(userId: number, rt: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashed_rt: AuthUtils.hashSha512(rt),
      },
    });
  }

  async getTokens(user: any) {
    const { id, first_name, last_name, email, coins } = user || {};
    const jwtPayload: JwtPayload = {
      sub: id,
      first_name,
      last_name,
      email,
      coins,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('AT_SECRET'),
        expiresIn: process.env.AT_EXPIRES_IN,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('RT_SECRET'),
        expiresIn: process.env.RT_EXPIRES_IN,
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async validateTokenPayload(sub: number, email: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: sub,
        email,
        active: true,
        hashed_rt: {
          not: null,
        },
      },
    });

    if (!user) throw new ForbiddenException(messages.user.notAccess);
  }

  async checkIfEmailExists(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        active: true,
      },
    });

    if (user) throw new BadRequestException(messages.user.alreadyExists);
  }
}
