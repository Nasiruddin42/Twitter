import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Murmur } from '../entities/murmur.entity';
import { User } from '../entities/user.entity';
import { CreateMurmurDto } from './dto/create-murmur.dto';
import { MurmurResponseDto } from './dto/murmur-response.dto';

@Injectable()
export class MurmurService {
  constructor(
    @InjectRepository(Murmur)
    private murmursRepository: Repository<Murmur>,
  ) {}
  
  // Helper to map entity to safe DTO
  private mapToResponseDto(murmur: Murmur): MurmurResponseDto {
    const { user, ...murmurData } = murmur;
    // Handle cases where user might not be loaded to prevent crashes
    const safeUser = user ? {
      id: user.id,
      username: user.username,
      bio: user.bio,
    } : null;
    
    return {
      ...murmurData,
      user: safeUser as any,
      isLiked: false, 
      isFollowed: false, 
    };
  }

  // --- NEW: FETCH MURMURS FOR A SPECIFIC USER ---
  async findByUser(userId: number): Promise<MurmurResponseDto[]> {
    const murmurs = await this.murmursRepository.find({
      where: { user: { id: userId } }, // Filters by the user relation ID
      relations: ['user'],             // Ensures we get the username for the UI
      order: { createdAt: 'DESC' },     // Shows newest posts at the top
    });

    return murmurs.map(m => this.mapToResponseDto(m));
  }

  // CREATE
  async create(createMurmurDto: CreateMurmurDto, user: User): Promise<MurmurResponseDto> {
    const newMurmur = this.murmursRepository.create({
      content: createMurmurDto.content,
      user: user,
    });
    const savedMurmur = await this.murmursRepository.save(newMurmur);
    savedMurmur.user = user; 
    return this.mapToResponseDto(savedMurmur);
  }

  // READ (Single Murmur)
  async findOne(id: number): Promise<MurmurResponseDto> {
    const murmur = await this.murmursRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!murmur) {
      throw new NotFoundException(`Murmur with ID ${id} not found`);
    }

    return this.mapToResponseDto(murmur);
  }

  // READ (All Murmurs)
  async findAll(): Promise<MurmurResponseDto[]> {
    const murmurs = await this.murmursRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
    return murmurs.map(m => this.mapToResponseDto(m));
  }
  
  // DELETE
  async delete(id: number, userId: number): Promise<void> {
    const result = await this.murmursRepository.delete({ id, user: { id: userId } });
    if (result.affected === 0) {
      throw new NotFoundException(`Murmur with ID ${id} not found or unauthorized`);
    }
  }
}