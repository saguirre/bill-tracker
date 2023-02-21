import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GroupService } from '../group.service';

@Injectable()
export class IsGroupAdminGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private groupService: GroupService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { headers, params } = context.switchToHttp().getRequest();
    const extractedToken = headers?.authorization?.split(' ')[1];
    Logger.debug(`extractedToken: ${extractedToken}`);
    const groupId = params?.id;
    Logger.debug(`groupId: ${groupId}`);
    const decodedToken = this.jwtService.decode(extractedToken);
    Logger.debug(`decodedToken: ${JSON.stringify(decodedToken)}`);
    const id = decodedToken['id'];
    if (!id || !groupId) return false;
    const group = await this.groupService.group({ id: Number(groupId) });
    Logger.debug(`group: ${JSON.stringify(group)}`);
    if (Number(id) === Number(group.adminId)) {
      return true;
    }
    return false;
  }
}
