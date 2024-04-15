import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { UserService } from '../../../Web Lab 3/src/service';
import { LoginDto, UserDto } from '../../../Web Lab 3/src/models';
import { UserAlreadyExists, UserNotFound } from '../../../Web Lab 3/src/shared';
import { UserLeanDoc } from '../../../Web Lab 3/src/schema';

@Controller({ path: '/users' })
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  async createUser(@Body() body: UserDto) {
    try {
      const result = await this.userService.createUser(body);
      return result;
    } catch (err) {
      if (err instanceof UserAlreadyExists) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }

  @Post('/login')
  async login(@Body() body: LoginDto) {
    try {
      const result = await this.userService.login(body);
      return { token: result };
    } catch (err) {
      if (err instanceof UserNotFound) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }

  @Get('/')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Post('/admin')
  async createAdmin(
    @Body() body: UserDto,
    @Req() req: Request & { user: UserLeanDoc },
  ) {
    try {
      const result = await this.userService.createAdmin(body, req);
      return result;
    } catch (err) {
      if (err instanceof UserAlreadyExists) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }

  @Post('/driver')
  async createDriver(@Body() body: UserDto) {
    try {
      const result = await this.userService.createDriver(body);
      return result;
    } catch (err) {
      if (err instanceof UserAlreadyExists) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }
}
