import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminModule } from 'src/admin/admin.module';
import { User } from 'src/user/user.model';
import { AuthModule } from '../auth/auth.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
/* import { AuthModule } from '../auth/auth.module';
import { User } from './user.model';
import { UsersController } from './users.controller';
import { UserService } from './users.service'; */

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    forwardRef(() => AuthModule),
    forwardRef(() => AdminModule),
    //forwardRef(() => OrdersModule),
    //forwardRef(() => CartModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, SequelizeModule.forFeature([User])],
})
export class UserModule {}
