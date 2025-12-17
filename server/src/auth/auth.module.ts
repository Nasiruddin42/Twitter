import { Module, forwardRef } from '@nestjs/common'; // <-- Import forwardRef
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from '../entities/session.entity';
import { SessionGuard } from './session.guard';

@Module({
  imports: [
    forwardRef(() => UserModule), // <-- Wrap the UserModule import
    TypeOrmModule.forFeature([Session])
  ],
  controllers: [AuthController],
  providers: [AuthService, SessionGuard],
  exports: [AuthService, SessionGuard],
})
export class AuthModule {}