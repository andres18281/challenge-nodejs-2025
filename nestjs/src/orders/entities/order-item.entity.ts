import { Table, Column, Model, DataType, ForeignKey, BelongsTo, PrimaryKey, Default } from 'sequelize-typescript';
import { Order } from './order.entity';

@Table({ tableName: 'order_items', timestamps: false })
export class OrderItem extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Order)
  @Column({ type: DataType.UUID, allowNull: false })
  orderId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  quantity: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  unitPrice: number;

  @BelongsTo(() => Order)
  order: Order;
}