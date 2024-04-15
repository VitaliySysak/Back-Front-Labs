import { Injectable } from '@nestjs/common';
import { OrderDto } from '../models';
import { Addresses, AddressesDoc, Orders, OrdersDoc } from '../schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { calculateDistance } from '../helper';
import { types, createdAt } from '../helper';
import { NotAllowed, OrderNotFound } from '../shared';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Orders.name)
    private readonly orderModel: Model<OrdersDoc>,
    @InjectModel(Addresses.name)
    private readonly addressesModel: Model<AddressesDoc>,
  ) {}
  async createOrder(body: OrderDto & { login: string }) {
    const startAddress = await this.addressesModel.find({ name: body.from });
    const endAddress = await this.addressesModel.find({ name: body.to });
    const endLong = startAddress.map((e) => e.location.longitude);
    const startLong = endAddress.map((e) => e.location.longitude);
    const startLat = startAddress.map((e) => e.location.latitude);
    const endLat = endAddress.map((e) => e.location.latitude);
    const distance = Number(
      calculateDistance(startLat, startLong, endLat, endLong).toFixed(2),
    );

    let price;
    if (body.type === 'standart') {
      price = distance * types.standart;
    } else if (body.type === 'lite') {
      price = distance * types.lite;
    } else if (body.type === 'universal') {
      price = distance * types.universal;
    } else {
      return 'type err';
    }

    const doc = new this.orderModel({
      ...body,
      createdAt,
      status: 'Active',
      distance: `${distance} km`,
      price: price,
      id: crypto.randomUUID(),
    });
    const order = await doc.save();
    return order;
  }

  async getAllOrders(user) {
    const allUserOrders = await this.orderModel.find({ login: user.login });
    const activeOrders = await this.orderModel.aggregate([
      { $match: { status: 'Active' } },
    ]);
    const allOrders = await this.orderModel.find({});

    if (user.type === 'Driver') {
      return activeOrders;
    } else if (user.type === 'Admin') {
      return allOrders;
    } else return allUserOrders;
  }

  async getLastFive(user) {
    const lastFiveOrders = await this.orderModel.aggregate([
      { $match: { login: user.login } },
      { $group: { _id: '$from', doc: { $first: '$$ROOT' } } },
      { $sort: { 'doc._id': -1 } },
      { $limit: 5 },
      { $replaceRoot: { newRoot: '$doc' } },
      { $project: { from: 1, _id: 0 } },
    ]);
    return lastFiveOrders.map((order) => order.from).reverse();
  }

  async ThreeUniqueAddress(user) {
    const lastThreeOrders = await this.orderModel.aggregate([
      { $match: { login: user.login } },
      { $group: { _id: '$to', doc: { $first: '$$ROOT' } } },
      { $sort: { 'doc._id': -1 } },
      { $limit: 3 },
      { $replaceRoot: { newRoot: '$doc' } },
      { $project: { to: 1, _id: 0 } },
    ]);
    return lastThreeOrders.map((e) => e.to).reverse();
  }

  async getLowestPrice(user) {
    const lowestOrder = await this.orderModel.aggregate([
      { $match: { login: user.login } },
      { $sort: { price: 1 } },
      { $limit: 1 },
    ]);
    return lowestOrder;
  }

  async getHighestPrice(user) {
    const highestOrder = await this.orderModel.aggregate([
      { $match: { login: user.login } },
      { $sort: { price: -1 } },
      { $limit: 1 },
    ]);
    return highestOrder;
  }

  async patchStatus(body, user, orderId) {
    const order = await this.orderModel.aggregate([
      { $match: { id: orderId } },
    ]);
    if (order.length === 0) {
      throw new OrderNotFound('Order does not exist');
    }

    const status = order[0].status;

    let access = {
      Customer: {
        Active: 'Rejected',
      },
      Driver: {
        Active: 'In progress',
        'In progress': 'Done',
      },
    };

    if (status === 'Done') {
      return { message: "Can't change done" };
    } else if (
      (user.type === 'Admin' && status === 'Active') ||
      ('In progress' && status != body.status)
    ) {
      await this.orderModel.updateOne(
        { id: orderId },
        { $set: { status: body.status } },
      );
      return { message: `Status updated successfully to ${body.status}` };
    } else if (access[user.type][status] != body.status) {
      throw new NotAllowed(
        `Status already ${body.status} or don\'t have permission`,
      );
    } else {
      await this.orderModel.updateOne(
        { id: orderId },
        { $set: { status: body.status } },
      );
      return { message: `Status updated successfully to ${body.status}` };
    }
  }
}
