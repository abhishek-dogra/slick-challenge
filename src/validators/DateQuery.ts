import { IsDateString } from 'class-validator';

export class DateQuery {
  @IsDateString()
  date: string;
}
