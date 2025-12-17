import { Controller, Post, Param, Delete, UseGuards, Request, Body } from '@nestjs/common';
import { FollowService } from './follow.service';
import { SessionGuard } from '../auth/session.guard';

@Controller('follows') // Base route: /api/follows
@UseGuards(SessionGuard)
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  // POST /api/follows/start
  @Post('start')
  async followUser(@Body('username') followedUsername: string, @Request() req: any) {
    const follow = await this.followService.followUser(req.user.id, followedUsername);
    return { 
        message: `Successfully followed ${followedUsername}`,
        followId: follow.id
    };
  }

  // DELETE /api/follows/stop
  @Delete('stop')
  async unfollowUser(@Body('username') followedUsername: string, @Request() req: any) {
    await this.followService.unfollowUser(req.user.id, followedUsername);
    return { message: `Successfully unfollowed ${followedUsername}` };
  }
}