import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { OrdersRepository } from './repository/orders.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { Order, OrderStatus } from './entities/order.entity';
import { Redis } from 'ioredis';

@Injectable()
export class OrdersService {
  private readonly CACHE_KEY = 'orders:active';
  private readonly CACHE_TTL = 30; // 30 segundos

  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  async findAll(): Promise<OrderResponseDto[]> {
    // Intentar obtener del caché
    const cached = await this.redisClient.get(this.CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }

    // Si no está en caché, consultar BD
    const orders = await this.ordersRepository.findAllActive();
    const response = orders.map(order => this.mapToDto(order));

    // Guardar en caché
    await this.redisClient.setex(
      this.CACHE_KEY,
      this.CACHE_TTL,
      JSON.stringify(response)
    );

    return response;
  }

  async findOne(id: string):  Promise<OrderResponseDto> {
    const order = await this.ordersRepository.findById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return this.mapToDto(order);
  }

  async create(createOrderDto: CreateOrderDto):  Promise<OrderResponseDto> {
    const order = await this.ordersRepository.create(createOrderDto);
    
    // Invalidar caché
    await this.redisClient.del(this.CACHE_KEY);

    return this.mapToDto(order);
  }

  async advanceStatus(id: string): Promise<OrderResponseDto> {
    const order = await this.ordersRepository.findById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const statusProgression = {
      [OrderStatus.INITIATED]: OrderStatus.SENT,
      [OrderStatus.SENT]: OrderStatus.DELIVERED,
    };

    const nextStatus = statusProgression[order.status];
    if (!nextStatus) {
      throw new BadRequestException('Order is already in final state');
    }

    // Si avanza a DELIVERED, eliminar de BD y caché
    if (nextStatus === OrderStatus.DELIVERED) {
      await this.ordersRepository.delete(id);
      await this.redisClient.del(this.CACHE_KEY);
      
      return {
        ...this.mapToDto(order),
        status: OrderStatus.DELIVERED
      };
    }

    // Actualizar estado
    const updatedOrder = await this.ordersRepository.updateStatus(id, nextStatus);
    
    // Invalidar caché
    await this.redisClient.del(this.CACHE_KEY);

    return this.mapToDto(updatedOrder!);
  }

   async deleteOldOrders(limitDate: Date): Promise<number> {
    return this.ordersRepository.deleteOldOrders(limitDate);

  }

  private mapToDto(order: Order): OrderResponseDto {
    return {
      id: order.id,
      clientName: order.clientName,
      status: order.status,
      totalAmount: Number(order.totalAmount),
      items: order.items?.map(item => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice)
      })) || [],
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    };
  }
}