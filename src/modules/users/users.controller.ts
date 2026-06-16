import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { BulkIdsDto } from './dto/bulk-ids.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public async findAll() {
    return await this.usersService.findAll();
  }

  @Post('block')
  public async bulkBlock(@Body() dto: BulkIdsDto) {
    return await this.usersService.bulkBlock(dto);
  }

  @Post('unblock')
  public async bulkUnblock(@Body() dto: BulkIdsDto) {
    return await this.usersService.bulkUnblock(dto);
  }

  @Delete()
  public async bulkDelete(@Body() dto: BulkIdsDto) {
    return await this.usersService.bulkDelete(dto);
  }
}
