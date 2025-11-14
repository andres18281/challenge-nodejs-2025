import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './repository/orders.repository';
import { OrderStatus } from './entities/order.entity';

describe('OrdersService', () => {
  let service: OrdersService;
  let repository: jest.Mocked<OrdersRepository>;
  let redis: any;

  const mockOrder: any = {
  id: '1',
  clientName: 'John',
  status: OrderStatus.INITIATED,
  totalAmount: 30,
  items: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: OrdersRepository,
          useValue: {
            findAllActive: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            updateStatus: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: 'REDIS_CLIENT',
          useValue: {
            get: jest.fn(),
            setex: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(OrdersService);
    repository = module.get(OrdersRepository);
    redis = module.get('REDIS_CLIENT');
  });

  it('should return cached data in findAll()', async () => {
    redis.get.mockResolvedValue(JSON.stringify([mockOrder]));

    const result = await service.findAll();

    expect(redis.get).toHaveBeenCalledWith('orders:active');
    expect(result.length).toBe(1);
  });

  it('should call repository if cache is empty', async () => {
    redis.get.mockResolvedValue(null);
    repository.findAllActive.mockResolvedValue([mockOrder]);

    const result = await service.findAll();

    expect(repository.findAllActive).toHaveBeenCalled();
    expect(redis.setex).toHaveBeenCalled();
    expect(result[0].id).toBe('1');
  });

  it('should throw if order not found', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findOne('99')).rejects.toThrow();
  });

  it('should create an order and clear cache', async () => {
    repository.create.mockResolvedValue(mockOrder);

    const result = await service.create({
      clientName: 'John',
      items: []
    });

    expect(redis.del).toHaveBeenCalledWith('orders:active');
    expect(result.id).toBe('1');
  });

  it('should advance order status from INITIATED -> SENT', async () => {
    repository.findById.mockResolvedValue(mockOrder);
    repository.updateStatus.mockResolvedValue({ ...mockOrder, status: OrderStatus.SENT });

    const result = await service.advanceStatus('1');

    expect(result.status).toBe(OrderStatus.SENT);
  });

  it('should delete order when advancing to DELIVERED', async () => {
    repository.findById.mockResolvedValue({ ...mockOrder, status: OrderStatus.SENT });

    const result = await service.advanceStatus('1');

    expect(repository.delete).toHaveBeenCalledWith('1');
    expect(result.status).toBe(OrderStatus.DELIVERED);
  });
});
