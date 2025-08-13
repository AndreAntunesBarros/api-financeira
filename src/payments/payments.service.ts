import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payments.entity';
import { CreatePaymentDto, UpdatePaymentDto } from './payments.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: number): Promise<Payment> {
    const conta = await this.paymentRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!conta) {
      throw new NotFoundException(`Conta com ID ${id} não encontrada.`);
    }

    return conta;
  }

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentRepository.create(createPaymentDto);
    return this.paymentRepository.save(payment);
  }

  async update(id: number, updateContaDto: UpdatePaymentDto): Promise<Payment> {
    const conta = await this.findOne(id);
    const updated = Object.assign(conta, updateContaDto);
    return this.paymentRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const conta = await this.findOne(id);
    await this.paymentRepository.remove(conta);
  }
}
