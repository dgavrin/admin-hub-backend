import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { Prisma, UserStatus } from 'generated/prisma/client';
import { ConfigService } from 'src/core/config/config.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async register(
    registerDto: RegisterDto,
  ): Promise<{ message: string }> {
    const passwordHash = await bcrypt.hash(registerDto.password, 10);
    const verificationToken = randomUUID();

    try {
      await this.prismaService.user.create({
        data: {
          name: registerDto.name,
          email: registerDto.email,
          passwordHash,
          verificationToken,
          verificationTokenExpiresAt: new Date(
            Date.now() + 1000 * 60 * 60 * 24,
          ),
        },
        omit: {
          passwordHash: true,
          verificationToken: true,
          verificationTokenExpiresAt: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('User cannot be created');
        }
      }
      throw error;
    }

    // TODO: Send verification email

    return {
      message:
        'Registered successfully. Please check your email for verification.',
    };
  }

  public async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; user: object }> {
    const user = await this.prismaService.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status === UserStatus.BLOCKED) {
      throw new ForbiddenException('Account is blocked');
    }

    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
      },
    });

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      passwordHash,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      verificationToken,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      verificationTokenExpiresAt,
      ...publicUser
    } = user;

    return {
      accessToken,
      user: publicUser,
    };
  }

  public async verifyEmail(
    verificationToken: string,
  ): Promise<{ message: string }> {
    const user = await this.prismaService.user.findFirst({
      where: { verificationToken },
    });

    if (!user) {
      throw new NotFoundException('Invalid verification token');
    }

    if (user.status === UserStatus.UNVERIFIED) {
      await this.prismaService.user.update({
        where: { id: user.id },
        data: {
          status: UserStatus.ACTIVE,
        },
      });
    }

    return { message: 'Email verified successfully' };
  }

  public async getMe(userId: string): Promise<object> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      omit: {
        passwordHash: true,
        verificationToken: true,
        verificationTokenExpiresAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
