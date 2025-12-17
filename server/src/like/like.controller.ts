import { Controller, Post, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { LikeService } from './like.service';
import { SessionGuard } from '../auth/session.guard';

@Controller('likes') // Base route: /api/likes
@UseGuards(SessionGuard)
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  // POST /api/likes/:murmurId
  @Post(':murmurId')
  async likeMurmur(@Param('murmurId') murmurId: string, @Request() req: any) {
    const like = await this.likeService.likeMurmur(req.user.id, +murmurId);
    return { 
        message: 'Murmur liked successfully',
        likeId: like.id
    };
  }

  // DELETE /api/likes/:murmurId
  @Delete(':murmurId')
  async unlikeMurmur(@Param('murmurId') murmurId: string, @Request() req: any) {
    await this.likeService.unlikeMurmur(req.user.id, +murmurId);
    return { message: 'Murmur unliked successfully' };
  }
}