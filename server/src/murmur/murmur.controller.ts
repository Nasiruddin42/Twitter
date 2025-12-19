import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { MurmurService } from './murmur.service';
import { CreateMurmurDto } from './dto/create-murmur.dto';
import { MurmurResponseDto } from './dto/murmur-response.dto';
import { SessionGuard } from '../auth/session.guard';
import { User } from '../entities/user.entity';

@Controller('murmurs') 
export class MurmurController {
  constructor(private readonly murmurService: MurmurService) {}

  @UseGuards(SessionGuard)
  @Post()
  async create(
    @Body() createMurmurDto: CreateMurmurDto, 
    @Request() req: any 
  ): Promise<MurmurResponseDto> {
    const user = req.user as User; 
    return this.murmurService.create(createMurmurDto, user);
  }

  @Get()
  async findAll(): Promise<MurmurResponseDto[]> {
    return this.murmurService.findAll();
  }

  // --- NEW: Handle /api/murmurs/user/:userId ---
  // This is what your ProfilePage.tsx is calling!
  @Get('user/:userId')
  async findByUser(@Param('userId', ParseIntPipe) userId: number): Promise<MurmurResponseDto[]> {
    return this.murmurService.findByUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<MurmurResponseDto> {
    return this.murmurService.findOne(id);
  }

  @UseGuards(SessionGuard)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any
  ): Promise<{ message: string }> {
    await this.murmurService.delete(id, req.user.id);
    return { message: 'Murmur deleted successfully' };
  }
}