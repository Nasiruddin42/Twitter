import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.usersRepository.create({
      username: createUserDto.username,
      email: createUserDto.email,
      passwordHash,
      bio: 'New Murmur user.',
    });
    return this.usersRepository.save(newUser);
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  // Used for fetching user profile (excluding password hash)
  async getProfile(id: number): Promise<Partial<User> | undefined> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) return undefined;
    
    // Selectively omit the passwordHash
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}