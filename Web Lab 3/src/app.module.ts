import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UserService } from './service/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Addresses, Orders, OrdersSchema, UserSchema, Users, AddressesSchema} from './schema';
import { UserAuthorizationMiddleware } from './midellware/userAuthorization.middleware';
import { OrdersController } from './controllers/orders.controller';
import { OrderService } from './service';
// import { AddressesService } from './service/addresses.service';
// import { AddressesController } from './controllers/adresses.controller';


@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://Vitaliy:1023@claster.vogzlwz.mongodb.net/?retryWrites=true&w=majority&appName=claster',
      { dbName: 'DataBase' },
    ),
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UserSchema,
      },
      {
        name: Orders.name,
        schema: OrdersSchema,
      },
      {
        name: Addresses.name,
        schema: AddressesSchema,
      },
    ]),
  ],
  controllers: [UsersController, OrdersController],
 
  providers: [UserService, OrderService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthorizationMiddleware).forRoutes('/orders');
  }
}
