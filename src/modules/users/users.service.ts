import { Injectable } from '@nestjs/common';
import { UserStatus, Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { BulkIdsDto } from './dto/bulk-ids.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll({
    page,
    limit,
    sortBy,
    sortOrder,
    search,
  }: FindUsersQueryDto) {
    const skip = (page - 1) * limit;
    const where: Prisma.UserWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};
    const select: Prisma.UserSelect = {
      id: true,
      name: true,
      email: true,
      status: true,
      lastLoginAt: true,
      createdAt: true,
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
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
