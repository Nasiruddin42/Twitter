import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { Follow } from '../entities/follow.entity';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module'; // <-- IMPORT AuthModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Follow]),
    UserModule,
    AuthModule, // <--- Add AuthModule here to enable SessionGuard
  ],
  controllers: [FollowController],
  providers: [FollowService],
  exports: [FollowService],
})
export class FollowModule {}