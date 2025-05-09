import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import {
  JwtAcademicClaim,
  JwtLecturerClaim,
  JwtStudentClaim,
} from 'src/commons/types/jwt.type';
import { SocketWithUser } from 'src/commons/types/notification.type';

@Injectable()
export class JwtCoreService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signStudentJwt(claim: JwtStudentClaim) {
    return this.jwtService.sign(claim);
  }

  async signLecturerJwt(claim: JwtLecturerClaim) {
    return this.jwtService.sign(claim);
  }

  async signAcademicJwt(claim: JwtAcademicClaim) {
    return this.jwtService.sign(claim);
  }

  verifyBearerToken(bearerToken: string) {
    return this.jwtService.verify(bearerToken, {
      secret: this.configService.get('JWT_SECRET'),
    });
  }

  verifyClient(client: SocketWithUser) {
    try {
      const token = client.handshake.headers?.authorization;

      if (!token) throw new WsException('Token required');

      const jwtPayload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      return jwtPayload;
    } catch (error) {
      throw new WsException('Token Invalid');
    }
  }
}
