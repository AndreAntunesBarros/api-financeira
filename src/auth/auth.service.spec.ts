import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  const user = {
    id: 1,
    email: 'test@test.com',
    password: 'hashed',
    name: 'Test User',
    created_at: new Date(),
    updated_at: new Date(),
    payments: [],
  };

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mocked-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('deve retornar o usuário se a senha estiver correta', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await authService.validateUser(
        'test@test.com',
        'password',
      );
      expect(result).toEqual(user);
    });

    it('deve retornar null se a senha for inválida', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const result = await authService.validateUser('test@test.com', 'wrong');
      expect(result).toBeNull();
    });

    it('deve retornar null se o usuário não for encontrado', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      const result = await authService.validateUser('notfound@test.com', '123');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('deve retornar um objeto com o access_token', () => {
      const user = { id: 1, email: 'test@test.com' };
      const result = authService.login(user);

      expect(result).toEqual({ access_token: 'mocked-jwt-token' });
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: user.email,
        sub: user.id,
      });
    });
  });

  describe('register', () => {
    it('deve criar um usuário com senha criptografada', async () => {
      const createUserDto = {
        email: 'new@test.com',
        password: 'plainpass',
        name: 'Test User',
        created_at: new Date(),
        updated_at: new Date(),
        payments: [],
      };
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpass');
      jest.spyOn(usersService, 'create').mockResolvedValue({
        id: 1,
        ...createUserDto,
        password: 'hashedpass',
        name: 'Test User',
        created_at: new Date(),
        updated_at: new Date(),
        payments: [],
      });

      const result = await authService.register(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('plainpass', 10);
      expect(usersService.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedpass',
      });
      expect(result).toMatchObject({
        id: 1,
        email: 'new@test.com',
        password: 'hashedpass',
      });
    });

    it('deve lançar erro se a criação falhar', async () => {
      const createUserDto = {
        email: 'fail@test.com',
        password: '123',
        name: 'Test User',
        created_at: new Date(),
        updated_at: new Date(),
        payments: [],
      };
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpass');
      jest
        .spyOn(usersService, 'create')
        .mockRejectedValue(new Error('DB error'));

      await expect(authService.register(createUserDto)).rejects.toThrow(
        'Falha ao registrar usuário: DB error',
      );
    });
  });
});
