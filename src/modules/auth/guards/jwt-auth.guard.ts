import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { JwtPayload } from '../strategies/jwt.strategy';
import { User, UserStatus } from 'generated/prisma/client';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isValid = await super.canActivate(context);
    if (!isValid) {
      return false;
    }

    const request = context.switchToHttp().getRequest<{ user: JwtPayload }>();
    const userId = request.user.sub;
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.status === UserStatus.BLOCKED) {
      throw new UnauthorizedException();
    }

    (request as unknown as { user: User }).user = user;
    return true;
  }
}
