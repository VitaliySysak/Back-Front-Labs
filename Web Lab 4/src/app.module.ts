import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UserService } from './service/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Links, LinksSchema, UserSchema, Users } from './schema';
import { UserAuthorizationMiddleware } from './middleware/authorization';
import { OrdersController } from './controllers/links.controller';
import { LinkService } from './service';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://Vitaliy:1023@claster.vogzlwz.mongodb.net/?retryWrites=true&w=majority&appName=claster',
      { dbName: 'DataBase2' },
    ),
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UserSchema,
      },
      {
        name: Links.name,
        schema: LinksSchema,
      },
    ]),
  ],
  controllers: [UsersController, OrdersController],

  providers: [UserService, LinkService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserAuthorizationMiddleware)
      .exclude('/links/:cut')
      .forRoutes('/links');
  }
}
