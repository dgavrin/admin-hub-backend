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
    return this.prisma.user
      .updateMany({
        where: { id: { in: bulkIdsDto.ids } },
        data: { status: UserStatus.BLOCKED },
      })
      .then((result) => ({
        success: result.count,
        failed: bulkIdsDto.ids.length - result.count,
      }));
  }

  public async bulkUnblock(bulkIdsDto: BulkIdsDto) {
    return this.prisma.user
      .updateMany({
        where: { id: { in: bulkIdsDto.ids } },
        data: { status: UserStatus.ACTIVE },
      })
      .then((result) => ({
        success: result.count,
        failed: bulkIdsDto.ids.length - result.count,
      }));
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
