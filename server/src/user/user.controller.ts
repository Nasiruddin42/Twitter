import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SessionGuard } from '../auth/session.guard'; // Will be created soon

@Controller('users') // Base route: /api/users
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    // Check if user already exists (you might handle this in service with exception)
    const existingUser = await this.userService.findOneByEmail(createUserDto.email);
    if (existingUser) {
      // In a real app, throw a ConflictException
      return { message: 'User already exists' };
    }
    
    const user = await this.userService.create(createUserDto);
    // Return safe data
    const { passwordHash, ...result } = user;
    return result;
  }
  
  @UseGuards(SessionGuard) // Protect this route
  @Get('profile')
  getProfile(@Request() req) {
    // req.user is populated by the SessionGuard
    // We already have the safe profile from the guard
    return req.user;
  }
}