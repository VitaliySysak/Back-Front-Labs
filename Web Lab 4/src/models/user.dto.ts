import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, IsEmail, IsOptional } from '@nestjs/class-validator';

export class UserDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  token?: string;
  
  @ApiProperty({ type: Number })
  @IsString()
  @IsOptional()
  creationTime?: Date;
}
