import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrdersService } from '../orders.service';
import { Op } from 'sequelize';

@Injectable()
export class OrdersCleanerJob {
  private readonly logger = new Logger(OrdersCleanerJob.name);

  constructor(private readonly ordersService: OrdersService) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleCleanupOldOrders() {
    this.logger.log('Iniciando limpieza de órdenes antiguas...');

    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() - 7);

    const deleted = await this.ordersService.deleteOldOrders(limitDate);

    this.logger.log(`Órdenes eliminadas: ${deleted}`);
  }
}