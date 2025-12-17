import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { MurmurService } from './murmur.service';
import { CreateMurmurDto } from './dto/create-murmur.dto';
import { MurmurResponseDto } from './dto/murmur-response.dto';
import { SessionGuard } from '../auth/session.guard'; // Import the guard
import { User } from '../entities/user.entity';

@Controller('murmurs') // Base route: /api/murmurs
export class MurmurController {
  constructor(private readonly murmurService: MurmurService) {}

  // POST /api/murmurs (Create Murmur) - Requires Authentication
  @UseGuards(SessionGuard)
  @Post()
  async create(
    @Body() createMurmurDto: CreateMurmurDto, 
    @Request() req: any // req.user is populated by SessionGuard
  ): Promise<MurmurResponseDto> {
    // The user attached to the request by the guard is the safe version (Partial<User>)
    // We need to pass the ID to the service, which will use the full User entity structure.
    const user = req.user as User; 
    return this.murmurService.create(createMurmurDto, user);
  }

  // GET /api/murmurs (Global Feed) - No Authentication required for viewing
  @Get()
  async findAll(): Promise<MurmurResponseDto[]> {
    return this.murmurService.findAll();
  }

  // GET /api/murmurs/:id (View Single Murmur) - No Authentication required
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MurmurResponseDto> {
    return this.murmurService.findOne(+id);
  }

  // DELETE /api/murmurs/:id (Delete Murmur) - Requires Authentication and ownership
  @UseGuards(SessionGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Request() req: any
  ): Promise<{ message: string }> {
    await this.murmurService.delete(+id, req.user.id);
    return { message: 'Murmur deleted successfully' };
  }
}