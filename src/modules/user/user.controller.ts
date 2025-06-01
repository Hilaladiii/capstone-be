import {
  Body,
  Controller,
  Get,
  Patch,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Auth } from 'src/commons/decorators/auth.decorator';
import { GetCurrentUser } from 'src/commons/decorators/get-current-user.decorator';
import { Message } from 'src/commons/decorators/message.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Put('change-password')
  @Message('Success change your password')
  @Auth()
  async changePassword(
    @GetCurrentUser('sub') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.userService.changePassword({ ...changePasswordDto, userId });
  }

  @Get()
  @Message('Success get profile')
  @Auth()
  async getProfile(@GetCurrentUser('sub') userId: string) {
    return await this.userService.getProfile(userId);
  }

  @Patch()
  @Message('Success update profile')
  @Auth()
  @UseInterceptors(FileInterceptor('image'))
  async updateProfile(
    @GetCurrentUser('sub') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.userService.updateProfile({ ...updateUserDto, image, userId });
  }
}
