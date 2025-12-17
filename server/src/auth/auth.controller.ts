import { Controller, Post, Body, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { SessionGuard } from './session.guard';

// Constants for cookie
const COOKIE_NAME = 'murmur-session-token';
const COOKIE_OPTIONS = { 
  httpOnly: true, // Prevents client-side access
  secure: false, // Should be true in production (HTTPS)
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  sameSite: 'lax' as const,
};

@Controller('auth') // Base route: /api/auth
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(loginDto);
    
    // Set the session token as an HTTP-only cookie
    res.cookie(COOKIE_NAME, result.token, COOKIE_OPTIONS);
    
    return { user: result.user };
  }

  @UseGuards(SessionGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies[COOKIE_NAME];
    await this.authService.logout(token);
    
    // Clear the cookie
    res.clearCookie(COOKIE_NAME);
    
    return { message: 'Logged out successfully' };
  }
  
  @UseGuards(SessionGuard)
  @Post('check') // Use to verify session on client load
  async checkSession(@Req() req: Request) {
      // SessionGuard ran and attached the user to the request
      return { user: req.user };
  }
}