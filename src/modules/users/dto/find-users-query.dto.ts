import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

const SORT_ORDER_VALUES = ['asc', 'desc'] as const;
const SORTABLE_USER_FIELDS = [
  'name',
  'email',
  'status',
  'createdAt',
  'lastLoginAt',
] as const;
type SortOrder = (typeof SORT_ORDER_VALUES)[number];
type SortableUserField = (typeof SORTABLE_USER_FIELDS)[number];

export class FindUsersQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit: number = 20;

  @IsOptional()
  @IsIn(SORTABLE_USER_FIELDS)
  sortBy: SortableUserField = 'lastLoginAt';

  @IsOptional()
  @IsIn(SORT_ORDER_VALUES)
  sortOrder: SortOrder = 'desc';

  @IsOptional()
  @IsString()
  search?: string;
}
