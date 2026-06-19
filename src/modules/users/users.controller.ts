import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BulkIdsDto } from './dto/bulk-ids.dto';
import { UsersService } from './users.service';
import { FindUsersQueryDto } from './dto/find-users-query.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async findAll(@Query() query: FindUsersQueryDto) {
    return await this.usersService.findAll(query);
  }

  @Post('block')
  @HttpCode(HttpStatus.OK)
  public async bulkBlock(@Body() dto: BulkIdsDto) {
    return await this.usersService.bulkBlock(dto);
  }

  @Post('unblock')
  @HttpCode(HttpStatus.OK)
  public async bulkUnblock(@Body() dto: BulkIdsDto) {
    return await this.usersService.bulkUnblock(dto);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  public async bulkDelete(@Body() dto: BulkIdsDto) {
    return await this.usersService.bulkDelete(dto);
  }

  @Delete('unverified')
  @HttpCode(HttpStatus.OK)
  public async deleteUnverifiedUsers() {
    return await this.usersService.deleteUnverified();
  }
}
