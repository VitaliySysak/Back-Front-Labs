import { Injectable } from '@nestjs/common';
import { LoginDto, UserDto } from '../models';
import { UserDoc, Users } from '../schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserAlreadyExists, UserNotFound } from '../shared';
import { randomUUID } from 'crypto';
import { SUPER_PASSWORD } from '../helper';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Users.name)
    private readonly userModel: Model<UserDoc>,
  ) {}

  async createUser(body: UserDto) {
    const isExists = await this.userModel.findOne({
      login: body.login,
    });

    if (isExists) {
      throw new UserAlreadyExists(
        `User with login ${body.login} already exists`,
      );
    }
    const data = { ...body, type: 'Customer' };
    /**
     * Validation of data
     */
    const doc = new this.userModel(data);
    /**
     * Save to db
     */
    const user = await doc.save();

    return user.toObject();
  }

  async login(body: LoginDto) {
    const user = await this.userModel.findOne({
      login: body.login,
      password: body.password,
    });

    if (!user) {
      throw new UserNotFound(`User with login ${body.login} was not found`);
    }

    user.token = randomUUID();

    await user.save();

    return user.token;
  }

  async getAllUsers() {
    const users = await this.userModel.find(
      {},
      { token: false, password: false, login: false },
    );

    return users.map((user) => user.toObject());
  }

  async createAdmin(body: UserDto, req) {
    const { headers } = req;
    if (headers.authorization != SUPER_PASSWORD) {
      return { message: 'wrong super-password' };
    }
    const isExists = await this.userModel.findOne({
      login: body.login,
    });

    if (isExists) {
      throw new UserAlreadyExists(
        `User with login ${body.login} already exists`,
      );
    }

    const data = { ...body, type: 'Admin' };
    /**
     * Validation of data
     */
    const doc = new this.userModel(data);
    /**
     * Save to db
     */
    const user = await doc.save();

    return user.toObject();
  }

  async createDriver(body: UserDto) {
    const isExists = await this.userModel.findOne({
      login: body.login,
    });

    if (isExists) {
      throw new UserAlreadyExists(
        `User with login ${body.login} already exists`,
      );
    }
    const data = { ...body, type: 'Driver' };
    /**
     * Validation of data
     */
    const doc = new this.userModel(data);
    /**
     * Save to db
     */
    const user = await doc.save();

    return user.toObject();
  }
}
