import { Test, TestingModule } from '@nestjs/testing';
import { OrdersRepository } from './orders.repository';
import { getModelToken } from '@nestjs/sequelize';
import { Order, OrderStatus } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Op } from 'sequelize';

describe('OrdersRepository', () => {
  let repository: OrdersRepository;

  const mockOrderModel = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
  };

  const mockOrderItemModel = {
    bulkCreate: jest.fn(),
  };

  const mockOrderInstance = {
    id: '1',
    status: OrderStatus.INITIATED,
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersRepository,
        {
          provide: getModelToken(Order),
          useValue: mockOrderModel,
        },
        {
          provide: getModelToken(OrderItem),
          useValue: mockOrderItemModel,
        },
      ],
    }).compile();

    repository = module.get<OrdersRepository>(OrdersRepository);

    jest.clearAllMocks();
  });

  // -------------------------------------------------------------------
  // findAllActive()
  // -------------------------------------------------------------------
  describe('findAllActive', () => {
    it('should return all active orders', async () => {
      const ordersMock = [{ id: '1' }, { id: '2' }];
      mockOrderModel.findAll.mockResolvedValue(ordersMock);

      const result = await repository.findAllActive();

      expect(mockOrderModel.findAll).toHaveBeenCalledWith({
        where: {
          status: {
            [Op.ne]: OrderStatus.DELIVERED,
          },
        },
        include: [OrderItem],
        order: [['createdAt', 'DESC']],
      });
      expect(result).toEqual(ordersMock);
    });
  });

  // -------------------------------------------------------------------
  // findById()
  // -------------------------------------------------------------------
  describe('findById', () => {
    it('should return an order by id', async () => {
      const orderMock = { id: '123' };
      mockOrderModel.findByPk.mockResolvedValue(orderMock);

      const result = await repository.findById('123');

      expect(mockOrderModel.findByPk).toHaveBeenCalledWith('123', {
        include: [OrderItem],
      });
      expect(result).toEqual(orderMock);
    });

    it('should return null if order is not found', async () => {
      mockOrderModel.findByPk.mockResolvedValue(null);

      const result = await repository.findById('999');

      expect(result).toBeNull();
    });
  });

  // -------------------------------------------------------------------
  // create()
  // -------------------------------------------------------------------
  describe('create', () => {
    it('should create an order and items', async () => {
      const dto = {
        clientName: 'John',
        items: [
          { description: 'Item1', quantity: 2, unitPrice: 10 },
          { description: 'Item2', quantity: 1, unitPrice: 20 },
        ],
      };

      const createdOrderMock = { 
          ...mockOrderInstance,
          id: '1' 
      };

      mockOrderModel.create.mockResolvedValue(createdOrderMock);
      mockOrderModel.findByPk.mockResolvedValue(createdOrderMock);

      const result = await repository.create(dto);

      // totalAmount calculation check
      expect(mockOrderModel.create).toHaveBeenCalledWith({
        clientName: dto.clientName,
        totalAmount: 40, // (2 * 10) + (1 * 20)
        status: OrderStatus.INITIATED,
      });

      expect(mockOrderItemModel.bulkCreate).toHaveBeenCalledWith([
        {
          orderId: '1',
          description: 'Item1',
          quantity: 2,
          unitPrice: 10,
        },
        {
          orderId: '1',
          description: 'Item2',
          quantity: 1,
          unitPrice: 20,
        },
      ]);

      expect(result).toEqual(createdOrderMock);
    });
  });

  // -------------------------------------------------------------------
  // updateStatus()
  // -------------------------------------------------------------------
  describe('updateStatus', () => {
    it('should update the order status', async () => {
      mockOrderModel.findByPk.mockResolvedValue(mockOrderInstance);

      const result = await repository.updateStatus('1', OrderStatus.DELIVERED);

      expect(mockOrderModel.findByPk).toHaveBeenCalled();
      expect(mockOrderInstance.status).toBe(OrderStatus.DELIVERED);
      expect(mockOrderInstance.save).toHaveBeenCalled();
      expect(result).toEqual(mockOrderInstance);
    });

    it('should return null if order does not exist', async () => {
      mockOrderModel.findByPk.mockResolvedValue(null);

      const result = await repository.updateStatus('404', OrderStatus.DELIVERED);

      expect(result).toBeNull();
    });
  });

  // -------------------------------------------------------------------
  // delete()
  // -------------------------------------------------------------------
  describe('delete', () => {
    it('should return true when an order is deleted', async () => {
      mockOrderModel.destroy.mockResolvedValue(1);

      const result = await repository.delete('1');

      expect(mockOrderModel.destroy).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toBe(true);
    });

    it('should return false when no rows are deleted', async () => {
      mockOrderModel.destroy.mockResolvedValue(0);

      const result = await repository.delete('1');

      expect(result).toBe(false);
    });
  });
});