import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserRole } from 'src/common/enums/user-role.enum';
import { JWT_SECRET } from '../../common/constants';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    
    if (!authorization) return false;
    const token = authorization.split(' ')[1];
    if (!token) {
      return false;
    }
    try {
      const verified: any = jwt.verify(token, JWT_SECRET);
      if (verified && verified.role == UserRole.SUPER_USER) {
        request.user = verified.user;
        return true;
      } else {
        return false;
      }
    } catch (err) {
      throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);
    }
  }
}
