import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetUserId } from 'src/common/decorators';
import { messages } from 'src/common/response/message.model';
import { ResponseModel } from 'src/common/response/response.model';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOkResponse({
    schema: {
      example: {
        first_name: '',
        last_name: '',
        email: '',
      },
    },
  })
  @ApiBadRequestResponse({
    schema: {
      example: new ResponseModel(
        HttpStatus.BAD_REQUEST,
        messages.user.notExists,
      ),
    },
  })
  @Get('active')
  active(@GetUserId() userId: number) {
    return this.userService.findById(userId);
  }
}
