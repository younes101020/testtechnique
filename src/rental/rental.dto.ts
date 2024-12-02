import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  IsTimeZone,
  Max,
  Min,
} from 'class-validator';

export class CreateRentalDto {
  @IsInt()
  inventory_id: number;

  @IsInt()
  customer_id: number;

  @IsInt()
  staff_id: number;

  @IsDate()
  @Type(() => Date)
  rental_date: Date;

  @IsString()
  @IsTimeZone()
  timezone: string;

  @IsInt()
  @Min(7)
  @Max(21)
  rental_duration: number;
}

export class UpdateRentalDto {
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  return_date?: Date;
}
