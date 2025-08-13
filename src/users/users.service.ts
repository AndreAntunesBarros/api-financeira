import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto, UpdateUserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`Usuário não encontrado.`);
    }
    return user;
  }

  async create(createuserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createuserDto);
    return this.userRepository.save(user);
  }

  async update(id: number, UpdateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    return this.userRepository.save(Object.assign(user, UpdateUserDto));
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.remove(await this.findOne(id));
  }
}
