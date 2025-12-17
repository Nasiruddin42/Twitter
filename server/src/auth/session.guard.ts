import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // 1. Check for the session token in the cookie
    const token = request.cookies['murmur-session-token']; 
    
    if (!token) {
      throw new UnauthorizedException('No session token provided');
    }

    // 2. Validate the session token and retrieve the user
    const user = await this.authService.validateSession(token);
    
    if (!user) {
      throw new UnauthorizedException('Invalid or expired session');
    }
    
    // 3. Attach the safe user profile to the request object for use in controllers
    const { passwordHash, ...safeUser } = user;
    request.user = safeUser; 
    
    return true;
  }
}