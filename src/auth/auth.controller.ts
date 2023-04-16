import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public, GetUserId, GetUser } from 'src/common/decorators';
import { RtGuard } from 'src/common/guards';
import { messages } from 'src/common/response/message.model';
import { ResponseModel } from 'src/common/response/response.model';
import { AuthService } from './auth.service';
import { AuthDto, RegistrationDto } from './dto';
import { Tokens } from './type';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOkResponse({
    schema: {
      example: {
        access_token: '',
        refresh_token: '',
      },
    },
  })
  @ApiForbiddenResponse({
    schema: {
      example: new ResponseModel(
        HttpStatus.FORBIDDEN,
        messages.user.wrongCredentials,
      ),
    },
  })
  @Public()
  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      example: new ResponseModel(HttpStatus.OK, messages.user.loggedOut),
    },
  })
  @ApiForbiddenResponse({
    schema: {
      example: new ResponseModel(
        HttpStatus.FORBIDDEN,
        messages.user.wrongCredentials,
      ),
    },
  })
  @Post('logout')
  logout(@GetUserId() userId: number) {
    return this.authService.logout(userId);
  }

  @ApiOkResponse({
    schema: {
      example: {
        access_token: '',
        refresh_token: '',
      },
    },
  })
  @ApiForbiddenResponse({
    schema: {
      example: new ResponseModel(HttpStatus.FORBIDDEN, messages.user.notAccess),
    },
  })
  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  refresh(
    @GetUserId() user_id: number,
    @GetUser('refreshToken') refresh_token: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(user_id, refresh_token);
  }

  @ApiOkResponse({
    schema: {
      example: new ResponseModel(HttpStatus.OK, messages.user.registration),
    },
  })
  @ApiBadRequestResponse({
    schema: {
      example: new ResponseModel(
        HttpStatus.BAD_REQUEST,
        messages.user.alreadyExists,
      ),
    },
  })
  @Public()
  @Post('registration')
  registration(@Body() dto: RegistrationDto) {
    return this.authService.registration(dto);
  }
}
