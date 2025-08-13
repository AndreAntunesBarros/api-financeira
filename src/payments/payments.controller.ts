import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, UpdatePaymentDto } from './payments.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.paymentsService.findOne(id);
  }

  @Post()
  create(@Body() createContaDto: CreatePaymentDto) {
    return this.paymentsService.create(createContaDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateContaDto: UpdatePaymentDto) {
    return this.paymentsService.update(id, updateContaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.paymentsService.remove(id);
  }
}
