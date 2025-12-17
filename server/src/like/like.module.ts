import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { Like } from '../entities/like.entity';
import { MurmurModule } from '../murmur/murmur.module';
import { AuthModule } from '../auth/auth.module'; // <-- IMPORT AuthModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Like]),
    MurmurModule,
    AuthModule, // <--- Add AuthModule here to enable SessionGuard
  ],
  controllers: [LikeController],
  providers: [LikeService],
  exports: [LikeService],
})
export class LikeModule {}