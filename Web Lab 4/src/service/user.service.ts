import { Injectable } from '@nestjs/common';
import { LoginDto, UserDto } from '../models';
import { UserDoc, Users } from '../schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserAlreadyExists, UserNotFound, EmailRequired } from '../shared';
import { randomUUID } from 'crypto';
import { expireMinutes, setExpirationDate } from '../helper';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Users.name)
    private readonly userModel: Model<UserDoc>,
  ) {}

  async createUser(body: UserDto) {
    const isExists = await this.userModel.findOne({
      email: body.email,
    });

    if (isExists) {
      throw new UserAlreadyExists(`This ${body.email} email is already in use`);
    }
    const creationTime = setExpirationDate(0)
    body.token = randomUUID();
    
    body.creationTime = creationTime

    const doc = new this.userModel(body);

    const user = await doc.save();
    return user.toObject();
  }

  async login(body: LoginDto) {
    const user = await this.userModel.findOne({
      email: body.email,
      password: body.password,
    });

    if (!user) {
      throw new UserNotFound(`User with email ${body.email} was not found`);
    }

    user.token = randomUUID();
    await user.save();

    return user.toObject();
  }

  async getAllUsers() {
    const users = await this.userModel.find({});

    return users.map((user) => user.toObject());
  }
}
