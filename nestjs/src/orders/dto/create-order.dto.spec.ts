import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateOrderDto } from './create-order.dto';

describe('CreateOrderDto', () => {
  it('should validate a correct DTO', async () => {
    const dto = plainToInstance(CreateOrderDto, {
      clientName: 'Carlos',
      items: [
        { description: 'Pizza', quantity: 2, unitPrice: 10 }
      ],
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if clientName is empty', async () => {
    const dto = plainToInstance(CreateOrderDto, {
      clientName: '',
      items: [
        { description: 'Pizza', quantity: 2, unitPrice: 10 }
      ],
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail if items array is empty', async () => {
    const dto = plainToInstance(CreateOrderDto, {
      clientName: 'Carlos',
      items: [],
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail if an item has invalid fields', async () => {
    const dto = plainToInstance(CreateOrderDto, {
      clientName: 'Carlos',
      items: [
        { description: '', quantity: 0, unitPrice: -1 }
      ],
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
