import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MurmurService } from './murmur.service';
import { MurmurController } from './murmur.controller';
import { Murmur } from '../entities/murmur.entity';
import { UserModule } from '../user/user.module'; // Needed to fetch user data
import { AuthModule } from '../auth/auth.module'; // Needed for SessionGuard

@Module({
  imports: [
    TypeOrmModule.forFeature([Murmur]),
    UserModule,
    AuthModule,
  ],
  controllers: [MurmurController],
  providers: [MurmurService],
  exports: [MurmurService],
})
export class MurmurModule {}