import { Table, Column, Model, DataType, HasMany, PrimaryKey, Default } from 'sequelize-typescript';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  INITIATED = 'initiated',
  SENT = 'sent',
  DELIVERED = 'delivered'
}

@Table({ tableName: 'orders', timestamps: true })
export class Order extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  clientName: string;

  @Column({
    type: DataType.ENUM(...Object.values(OrderStatus)),
    defaultValue: OrderStatus.INITIATED
  })
  status: OrderStatus;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  totalAmount: number;

  @HasMany(() => OrderItem, { onDelete: 'CASCADE' })
  items: OrderItem[];
}