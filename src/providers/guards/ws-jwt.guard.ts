import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Observable } from 'rxjs';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const client = context.switchToWs().getClient();
      const token = client.handshake.headers?.authorization;

      if (!token) throw new WsException('Token not found');

      const jwtPayload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      client.user = jwtPayload;

      return true;
    } catch (error) {
      throw new WsException('Invalid token');
    }
  }
}
