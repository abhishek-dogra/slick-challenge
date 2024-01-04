import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FetchTopNUsersQuery {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  year: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  n: number;
}
