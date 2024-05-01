import { IsString, IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PartsDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  otp: string;
}