import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from '../entities/follow.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private followsRepository: Repository<Follow>,
    private userService: UserService,
  ) {}

  async followUser(followerId: number, followedUsername: string): Promise<Follow> {
    const followedUser = await this.userService.findOneByEmail(followedUsername); // Using email as unique identifier for simplicity, can use username/ID
    
    if (!followedUser) {
        throw new NotFoundException('User to follow not found');
    }

    if (followerId === followedUser.id) {
        throw new BadRequestException('Cannot follow yourself');
    }
    
    const existingFollow = await this.followsRepository.findOne({
        where: { 
            follower: { id: followerId }, 
            followed: { id: followedUser.id } 
        }
    });

    if (existingFollow) {
        // Already following
        return existingFollow;
    }

    const newFollow = this.followsRepository.create({
      follower: { id: followerId },
      followed: followedUser,
    });

    return this.followsRepository.save(newFollow);
  }

  async unfollowUser(followerId: number, followedUsername: string): Promise<{ affected: number }> {
    const followedUser = await this.userService.findOneByEmail(followedUsername); // Using email as unique identifier
    
    if (!followedUser) {
        throw new NotFoundException('User to unfollow not found');
    }
    
    const result = await this.followsRepository.delete({
      follower: { id: followerId },
      followed: { id: followedUser.id },
    });
    
    if (result.affected === 0) {
        throw new NotFoundException('Not currently following this user');
    }

    return { affected: result.affected };
  }
}