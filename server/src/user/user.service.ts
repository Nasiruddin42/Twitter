import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm'; // Added Not and In for filtering
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

  // Renamed to findById to match what we put in the Controller
  async findById(id: number): Promise<Partial<User> | undefined> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) return undefined;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  // Logic for the "Who to Follow" list
  async findExploreUsers(): Promise<Partial<User>[]> {
    // For now, this just returns all users except the password.
    // In a real app, you would filter out users the current user already follows.
    const users = await this.usersRepository.find({
      take: 5,
      select: ['id', 'username', 'bio'], // Only send what the UI needs
    });
    return users;
  }

  async getProfile(id: number): Promise<Partial<User> | undefined> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) return undefined;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}