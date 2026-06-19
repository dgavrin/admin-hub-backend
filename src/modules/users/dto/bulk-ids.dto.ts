import { IsArray, IsUUID } from 'class-validator';

export class BulkIdsDto {
  @IsArray()
  @IsUUID('4', { each: true })
  ids: string[];
}
