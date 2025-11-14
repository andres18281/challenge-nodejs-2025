import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order, OrderStatus } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Op } from 'sequelize';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
    @InjectModel(OrderItem)
    private orderItemModel: typeof OrderItem,
  ) {}

  async findAllActive(): Promise<Order[]> {
    return this.orderModel.findAll({
      where: {
        status: {
          [Op.ne]: OrderStatus.DELIVERED
        }
      },
      include: [OrderItem],
      order: [['createdAt', 'DESC']]
    });
  }

  async findById(id: string):  Promise<Order | null> {
    return this.orderModel.findByPk(id, {
      include: [OrderItem]
    });
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const totalAmount = createOrderDto.items.reduce(
      (sum, item) => sum + (item.quantity * item.unitPrice),
      0
    );

    const order = await this.orderModel.create({
      clientName: createOrderDto.clientName,
      totalAmount,
      status: OrderStatus.INITIATED
    });

    const items = createOrderDto.items.map(item => ({
      orderId: order.id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice
    }));

    await this.orderItemModel.bulkCreate(items);

    return (await this.findById(order.id)) as Order;
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
    const order = await this.findById(id);
    if (!order) return null;

    order.status = status;
    await order.save();

    return order;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.orderModel.destroy({ where: { id } });
    return result > 0;
  }

  async deleteOldOrders(limitDate: Date): Promise<number> {
    return this.orderModel.destroy({
      where: {
        status: 'DELIVERED',
        updatedAt: {
          [Op.lt]: limitDate
        },
      },
    });
  }
}