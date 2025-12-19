import { Controller, Post, Body, Get, UseGuards, Request, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SessionGuard } from '../auth/session.guard';

@Controller('users') 
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findOneByEmail(createUserDto.email);
    if (existingUser) {
      return { message: 'User already exists' };
    }
    
    const user = await this.userService.create(createUserDto);
    const { passwordHash, ...result } = user;
    return result;
  }
  
  @UseGuards(SessionGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  // --- ADD THESE TWO METHODS BELOW ---

  @Get('explore') // Path: /api/users/explore
  async getExploreUsers() {
    return this.userService.findExploreUsers(); 
  }

  @Get(':id') // Path: /api/users/:id (Fixes the Profile Page 404)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }
}