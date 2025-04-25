import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Message } from 'src/commons/decorators/message.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Message('Success login into your account')
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto);
    return { token };
  }
}
