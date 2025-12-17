import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Session } from '../entities/session.entity';
import { UserService } from '../user/user.service';
import { User } from '../entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.userService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<{ token: string; user: Partial<User> }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Create a new session token (UUID is fine for a unique, random string)
    const token = uuid(); 
    
    // Set expiration time (e.g., 7 days)
    const expirationTime = new Date();
    expirationTime.setDate(expirationTime.getDate() + 7); 

    const newSession = this.sessionsRepository.create({
      token,
      user,
      expirationTime,
    });
    await this.sessionsRepository.save(newSession);

    // Return safe user data and the token
    const { passwordHash, ...safeUser } = user;
    return { token, user: safeUser };
  }

  async logout(token: string): Promise<void> {
    await this.sessionsRepository.delete({ token });
  }
  
  async validateSession(token: string): Promise<User | null> {
    if (!token) return null;
    
    // Find the session and eager load the user relationship
    const session = await this.sessionsRepository.findOne({
      where: { token },
      relations: ['user'],
    });

    if (session && session.expirationTime > new Date()) {
      return session.user;
    }
    
    // Clean up expired or invalid session
    if (session) {
        await this.sessionsRepository.delete({ token });
    }
    
    return null;
  }
}