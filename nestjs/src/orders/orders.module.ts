import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './repository/orders.repository';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    RedisModule,
    SequelizeModule.forFeature([Order, OrderItem])
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule {}