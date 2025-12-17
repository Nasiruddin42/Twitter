import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from '../entities/like.entity';
import { MurmurService } from '../murmur/murmur.service';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    private murmurService: MurmurService,
  ) {}
  
  // Helper to check if a user has liked a murmur
  async hasLiked(userId: number, murmurId: number): Promise<boolean> {
      const count = await this.likesRepository.count({
          where: {
              user: { id: userId },
              murmur: { id: murmurId },
          },
      });
      return count > 0;
  }

  async likeMurmur(userId: number, murmurId: number): Promise<Like> {
    // 1. Ensure the murmur exists (Service call handles exception)
    await this.murmurService.findOne(murmurId);

    try {
      const newLike = this.likesRepository.create({
        user: { id: userId },
        murmur: { id: murmurId },
      });
      
      const savedLike = await this.likesRepository.save(newLike);
      
      // OPTIONAL: Update likeCount in Murmur entity directly (requires transaction/query builder for efficiency)
      // For now, we rely on the DB relationship count if needed, but for simplicity, we keep it here:
      // await this.murmursRepository.increment({ id: murmurId }, 'likeCount', 1);

      return savedLike;
    } catch (e) {
      // Catch duplicate entry error (user already liked)
      if (e.code === 'ER_DUP_ENTRY' || (e.message && e.message.includes('Duplicate entry'))) {
          throw new BadRequestException('Murmur already liked by this user');
      }
      throw e;
    }
  }

  async unlikeMurmur(userId: number, murmurId: number): Promise<{ affected: number }> {
    // 1. Ensure the murmur exists (Service call handles exception)
    await this.murmurService.findOne(murmurId);
    
    const result = await this.likesRepository.delete({
      user: { id: userId },
      murmur: { id: murmurId },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Murmur was not liked by this user');
    }

    // OPTIONAL: Decrement likeCount in Murmur entity directly
    // await this.murmursRepository.decrement({ id: murmurId }, 'likeCount', 1);

    return { affected: result.affected };
  }
}