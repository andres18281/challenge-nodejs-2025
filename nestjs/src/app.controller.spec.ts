import { Test, TestingModule } from '@nestjs/testing';



import { OrdersController } from './orders/orders.controller';
import { OrdersService } from './orders/orders.service';
import { CreateOrderDto } from './orders/dto/create-order.dto';
import { OrderResponseDto } from './orders/dto/order-response.dto';
import { OrderStatus } from './orders/entities/order.entity';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  const mockOrdersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    advanceStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ---------------------
  //      TEST: GET /orders
  // ---------------------
  it('should return all orders', async () => {
    const result: OrderResponseDto[] = [
      {
        id: '1',
        clientName: 'Carlos Ruiz',
        items: [],
        totalAmount: 100,
        status: OrderStatus.INITIATED,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockOrdersService.findAll.mockResolvedValue(result);

    expect(await controller.findAll()).toBe(result);
    expect(service.findAll).toHaveBeenCalled();
  });

  // ---------------------
  //      TEST: GET /orders/:id
  // ---------------------
  it('should return one order by id', async () => {
    const order: OrderResponseDto = {
      id: '123',
      clientName: 'Ana',
      items: [],
      totalAmount: 50,
      status: OrderStatus.INITIATED,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockOrdersService.findOne.mockResolvedValue(order);

    expect(await controller.findOne('123')).toBe(order);
    expect(service.findOne).toHaveBeenCalledWith('123');
  });

  // ---------------------
  //      TEST: POST /orders
  // ---------------------
  it('should create an order', async () => {
    const dto: CreateOrderDto = {
      clientName: 'Luis',
      items: [
        { description: 'Hamburguesa', quantity: 1, unitPrice: 20 },
      ],
    };

    const created: OrderResponseDto = {
      id: 'abc',
      clientName: 'Luis',
      items: [],
      totalAmount: 20,
      status: OrderStatus.INITIATED,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockOrdersService.create.mockResolvedValue(created);

    expect(await controller.create(dto)).toBe(created);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  // ---------------------
  //   TEST: POST /orders/:id/advance
  // ---------------------
  it('should advance order status', async () => {
    const updated: OrderResponseDto = {
      id: 'xyz',
      clientName: 'Mario',
      items: [],
      totalAmount: 70,
      status: OrderStatus.SENT,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockOrdersService.advanceStatus.mockResolvedValue(updated);

    expect(await controller.advance('xyz')).toBe(updated);
    expect(service.advanceStatus).toHaveBeenCalledWith('xyz');
  });
});