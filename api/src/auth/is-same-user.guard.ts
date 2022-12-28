import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class IsSameUserGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const { headers, params } = context.switchToHttp().getRequest();
    const extractedToken = headers?.authorization?.split(' ')[1];
    const extractedId = params?.id;
    const decodedToken = this.jwtService.decode(extractedToken);
    const id = decodedToken['id'];
    if (id && extractedId && Number(id) === Number(extractedId)) {
      return true;
    }
    return false;
  }
}
