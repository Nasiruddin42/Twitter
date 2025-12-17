import { User } from '../../entities/user.entity';

// Define the shape of the user to be returned with the murmur
export interface MurmurUser {
  id: number;
  username: string;
  bio: string;
}

export class MurmurResponseDto {
  id: number;
  content: string;
  createdAt: Date;
  likeCount: number;
  user: MurmurUser;
  // This will be added in Phase 4
  isLiked: boolean = false; 
  // This will be added in Phase 4
  isFollowed: boolean = false;
}