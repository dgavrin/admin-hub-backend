import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { BulkIdsDto } from './dto/bulk-ids.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async findAll() {
    return await this.usersService.findAll();
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
}
