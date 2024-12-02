import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCustomerDto {
  @IsInt()
  store_id: number;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsInt()
  address_id: number;

  @IsBoolean()
  @IsOptional()
  activebool?: boolean = true;

  @IsInt()
  @IsOptional()
  active?: number;
}

export class UpdateCustomerDto {
  @IsString()
  @IsOptional()
  first_name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsInt()
  @IsOptional()
  address_id?: number;

  @IsBoolean()
  @IsOptional()
  activebool?: boolean;

  @IsInt()
  @IsOptional()
  active?: number;
}
