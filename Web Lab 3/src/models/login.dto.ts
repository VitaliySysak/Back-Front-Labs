import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from '@nestjs/class-validator';

export class LoginDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
