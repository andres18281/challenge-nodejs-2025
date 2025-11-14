import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus, ValidationPipe, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(): Promise<OrderResponseDto[]> {
    return this.ordersService.findAll();
  }

  @Get(':id')
   async findOne(@Param('id') id: string): Promise<OrderResponseDto> {
    return this.ordersService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createOrderDto: CreateOrderDto
    ): Promise<OrderResponseDto> {
    return this.ordersService.create(createOrderDto);
  }

  @Put(':id/advance')
  @HttpCode(HttpStatus.OK)
  async advance(@Param('id') id: string): Promise<OrderResponseDto> {
    return this.ordersService.advanceStatus(id);
  }
}