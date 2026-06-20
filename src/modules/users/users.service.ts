import { Injectable } from '@nestjs/common';
import { UserStatus } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { BulkIdsDto } from './dto/bulk-ids.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll() {
    return await this.prisma.user.findMany({
      orderBy: { lastLoginAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });
  }

  public async bulkBlock(bulkIdsDto: BulkIdsDto) {
    const [active, unverified] = await this.prisma.$transaction([
      this.prisma.user.updateMany({
        where: { id: { in: bulkIdsDto.ids }, status: UserStatus.ACTIVE },
        data: {
          status: UserStatus.BLOCKED,
          statusBeforeBlock: UserStatus.ACTIVE,
        },
      }),
      this.prisma.user.updateMany({
        where: { id: { in: bulkIdsDto.ids }, status: UserStatus.UNVERIFIED },
        data: {
          status: UserStatus.BLOCKED,
          statusBeforeBlock: UserStatus.UNVERIFIED,
        },
      }),
    ]);

    const success = active.count + unverified.count;
    const failed = bulkIdsDto.ids.length - success;

    return {
      success,
      failed,
    };
  }

  public async bulkUnblock(bulkIdsDto: BulkIdsDto) {
    const [active, unverified] = await this.prisma.$transaction([
      this.prisma.user.updateMany({
        where: {
          id: { in: bulkIdsDto.ids },
          status: UserStatus.BLOCKED,
          statusBeforeBlock: UserStatus.ACTIVE,
        },
        data: {
          status: UserStatus.ACTIVE,
          statusBeforeBlock: null,
        },
      }),
      this.prisma.user.updateMany({
        where: {
          id: { in: bulkIdsDto.ids },
          status: UserStatus.BLOCKED,
          statusBeforeBlock: UserStatus.UNVERIFIED,
        },
        data: {
          status: UserStatus.UNVERIFIED,
          statusBeforeBlock: null,
        },
      }),
    ]);

    const success = active.count + unverified.count;
    const failed = bulkIdsDto.ids.length - success;

    return {
      success,
      failed,
    };
  }

  public async bulkDelete(bulkIdsDto: BulkIdsDto) {
    return this.prisma.user
      .deleteMany({
        where: { id: { in: bulkIdsDto.ids } },
      })
      .then((result) => ({
        success: result.count,
        failed: bulkIdsDto.ids.length - result.count,
      }));
  }

  public async deleteUnverified() {
    return this.prisma.user
      .deleteMany({
        where: { status: UserStatus.UNVERIFIED },
      })
      .then((result) => ({
        success: result.count,
      }));
  }
}
