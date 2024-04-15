import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { OrderService } from '../../../Web Lab 3/src/service';
import { OrderDto, OrderRes, OrderPatch } from '../../../Web Lab 3/src/models';
import { UserLeanDoc } from '../../../Web Lab 3/src/schema';
import { OrderNotFound, NotAllowed } from '../../../Web Lab 3/src/shared';

@Controller({ path: '/orders' })
export class OrdersController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/')
  async createOrder(
    @Body() body: OrderDto,
    @Req() req: Request & { user: UserLeanDoc },
  ) {
    try {
      const { user } = req;

      const order = await this.orderService.createOrder({
        ...body,
        login: user.login,
      });
      if (order === 'type err') {
        return { message: 'type is not correct' };
      }
      return { message: 'Order was created', order };
    } catch (err) {
      throw err;
    }
  }
  @Get('/allOrders')
  async allOrders(@Req() req: Request & { user: UserLeanDoc }) {
    try {
      const { user } = req;

      const allOrders = await this.orderService.getAllOrders(user);
      return allOrders;
    } catch (err) {
      throw err;
    }
  }

  @Get('/lastFive')
  async getLastFive(@Req() req: Request & { user: UserLeanDoc }) {
    try {
      const { user } = req;

      const lastFive = await this.orderService.getLastFive(user);
      return lastFive;
    } catch (err) {
      throw err;
    }
  }

  @Get('/to/last-3')
  async ThreeUniqueAddress(@Req() req: Request & { user: UserLeanDoc }) {
    try {
      const { user } = req;

      const lastThree = await this.orderService.ThreeUniqueAddress(user);
      return lastThree;
    } catch (err) {
      throw err;
    }
  }

  @Get('/lowest')
  async lowestPrice(@Req() req: Request & { user: UserLeanDoc }) {
    try {
      const { user } = req;

      const lowestPrice = await this.orderService.getLowestPrice(user);
      return lowestPrice;
    } catch (err) {
      throw err;
    }
  }

  @Get('/biggest')
  async highestPrice(@Req() req: Request & { user: UserLeanDoc }) {
    try {
      const { user } = req;

      const highestPrice = await this.orderService.getHighestPrice(user);
      return highestPrice;
    } catch (err) {
      throw err;
    }
  }

  @Patch('/:orderId')
  async patchStatus(
    @Param('orderId') orderId: string,
    @Body() body: OrderPatch,
    @Req() req: Request & { user: UserLeanDoc },
  ) {
    try {
      const { user } = req;
      const result = await this.orderService.patchStatus(body, user, orderId);
      return result;
    } catch (err) {
      if (err instanceof OrderNotFound || err instanceof NotAllowed) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }
}
