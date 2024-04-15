import { IsString, IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  from: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  type: string;
}

export class OrderRes {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  price: number;
}

export class OrderPatch {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  status: string;
}