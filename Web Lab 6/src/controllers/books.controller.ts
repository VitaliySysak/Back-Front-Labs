import {
  Body,
  Controller,
  Post,
  Req,
  Get,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { BookService } from '../service';
import { BookDto, PartsDto } from '../models';
import { UserLeanDoc } from '../schema';
import { OtpNotMatch } from 'src/shared';

@Controller({ path: '/books' })
export class BooksController {
  constructor(private readonly bookService: BookService) {}

  @Post('/')
  async createBook(
    @Body() body: BookDto,
    @Req() req: Request & { user: UserLeanDoc },
  ) {
    try {
      const { user } = req;

      const book = await this.bookService.createBook({
        ...body,
        email: user.email,
      });
      return book;
    } catch (err) {
      throw err;
    }
  }

  @Get('/')
  async getBook(@Req() req: Request & { user: UserLeanDoc }) {
    try {
      const { user } = req;

      const books = await this.bookService.getBook(user);
      return books;
    } catch (err) {
      throw err;
    }
  }

  @Get('/parts')
  async getParts(@Req() req: Request & { user: UserLeanDoc }) {
    try {
      const { user } = req;

      const randomPart = await this.bookService.getParts();
      return randomPart;
    } catch (err) {
      throw err;
    }
  }

  @Post('/parts/:_id')
  async postParts(
    @Req() req: Request & { user: UserLeanDoc },
    @Body() body: PartsDto,
    @Param('_id') partId: string,
  ) {
    try {
      const partText = await this.bookService.postParts(partId, body);
      return `Your answer ${partText} was saved successfully👌 Thanks for your help!!!`;
    } catch (err) {
      if (err instanceof OtpNotMatch) {
        throw new BadRequestException(err.message);
      }
    }
  }
}
