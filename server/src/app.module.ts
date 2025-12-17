import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// Import all entities
import { User } from './entities/user.entity';
import { Murmur } from './entities/murmur.entity';
import { Follow } from './entities/follow.entity';
import { Like } from './entities/like.entity';
import { Session } from './entities/session.entity';
// ... other imports
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MurmurModule } from './murmur/murmur.module';
import { FollowModule } from './follow/follow.module'; // <--- Import Follow Module
import { LikeModule } from './like/like.module';     // <--- Import Like Module

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'docker',
      password: 'docker',
      database: 'test',
      // Include all entities here
      entities: [User, Murmur, Follow, Like, Session], 
      synchronize: true, // ONLY for development! Creates tables automatically.
    }),
    // TypeOrmModule.forFeature([User]), // This is moved to specific feature modules later
    UserModule, // <--- Add UserModule
    AuthModule, // <--- Add AuthModule
    MurmurModule,
    FollowModule, // <--- Add FollowModule here
    LikeModule,   // <--- Add LikeModule here
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}