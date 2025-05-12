import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { JwtCoreService } from 'src/modules/jwt-core/jwt-core.service';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private jwtCoreService: JwtCoreService) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const bearerToken = request.headers.authorization?.replace('Bearer ', '');

      if (!bearerToken) return false;

      const token = this.jwtCoreService.verifyBearerToken(bearerToken);

      if (!token) return false;

      request.user = token;

      return true;
    } catch (error) {
      return false;
    }
  }
}
