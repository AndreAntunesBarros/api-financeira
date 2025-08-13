import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
  IsIn,
} from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  user_id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  details?: string;

  @IsIn(['S', 'N'])
  @IsOptional()
  recurring?: string;

  @IsDateString()
  @IsOptional()
  due_date?: string;

  @IsNumber()
  amount: number;
}

export class UpdatePaymentDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  details?: string;

  @IsIn(['S', 'N'])
  @IsOptional()
  recurring?: string;

  @IsDateString()
  @IsOptional()
  due_date?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;
}
