import { OrderResponseDto } from './order-response.dto';
import { OrderStatus } from '../entities/order.entity';

describe('OrderResponseDto', () => {
  it('should create an OrderResponseDto object', () => {
    const dto = new OrderResponseDto();
    dto.id = '1';
    dto.clientName = 'Juan';
    dto.status = OrderStatus.INITIATED;
    dto.totalAmount = 50;
    dto.items = [];
    dto.createdAt = new Date();
    dto.updatedAt = new Date();

    expect(dto).toBeDefined();
    expect(dto.clientName).toBe('Juan');
    expect(dto.status).toBe(OrderStatus.INITIATED);
  });
});