import { OrderStatus } from '../entities/order.entity';

export class OrderItemResponseDto {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export class OrderResponseDto {
  id: string;
  clientName: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItemResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}