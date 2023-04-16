import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RtStrategy, AtStrategy } from './strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthService, AtStrategy, RtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
