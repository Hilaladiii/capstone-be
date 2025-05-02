import { Body, Controller, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Auth } from 'src/commons/decorators/auth.decorator';
import { GetCurrentUser } from 'src/commons/decorators/get-current-user.decorator';
import { Message } from 'src/commons/decorators/message.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Put('change-password')
  @Message('Success change your password')
  @Auth()
  async changePassword(
    @GetCurrentUser('sub') user_id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    console.log(user_id);
    await this.userService.changePassword({ ...changePasswordDto, user_id });
  }
}
