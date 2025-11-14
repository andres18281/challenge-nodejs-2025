import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';

export const databaseConfig = (): SequelizeModuleOptions => ({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'restaurant_orders',
  models: [Order, OrderItem],
  autoLoadModels: true,
  synchronize: true, // En producción usar migraciones
  logging: false,
});