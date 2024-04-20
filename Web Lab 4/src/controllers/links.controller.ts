import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  Get,
  Param,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { LinkService } from '../service';
import { LinkDto } from '../models';
import { UserLeanDoc } from '../schema';
import { Response } from 'express';
import { Transform, Type } from 'class-transformer';

class LinkExpiredAtQuery {
  @Type(() => Date)
  lt: Date;
  @Type(() => Date)
  gt: Date;
}

class LinkQuery {
  @Type(() => LinkExpiredAtQuery)
  @Transform(({ value }) => JSON.parse(value || '{}'))
  expiredAt: LinkExpiredAtQuery;
}

@Controller({ path: '/links' })
export class OrdersController {
  constructor(private readonly linkService: LinkService) {}

  @Post('/')
  async createLink(
    @Body() body: LinkDto,
    @Req() req: Request & { user: UserLeanDoc },
  ) {
    try {
      const { user } = req;

      const order = await this.linkService.createLink({
        ...body,
        email: user.email,
      });
      return order;
    } catch (err) {
      throw err;
    }
  }

  @Get('/')
  async getExpired(
    @Query() query: LinkQuery,
    @Req() req: Request & { user: UserLeanDoc },
  ) {
    try {
      const { user } = req;

      const expirationDate = await this.linkService.getExpired(query, user);
      return expirationDate;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Get('/:cut')
  async getLink(
    @Res() res: Response,
    @Param('cut') cut: string,
    @Req() req: Request & { user: UserLeanDoc },
  ) {
    try {
      const { user } = req;
      const originalLink = await this.linkService.getLink(cut, user);
      return res.redirect(originalLink);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
