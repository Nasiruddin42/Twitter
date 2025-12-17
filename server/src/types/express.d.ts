// If the types directory doesn't exist:
// nasir@nasir-HP:~/Documents/Twitter/webapp-test (1)/webapp-test/server/src$ mkdir types

// File: server/src/types/express.d.ts

import { User } from '../entities/user.entity';

// Define the shape of the user attached to the request by the SessionGuard
type RequestUser = Omit<User, 'passwordHash' | 'sessions' | 'murmurs' | 'likes' | 'following' | 'followers'>;

declare global {
  namespace Express {
    // Extend the Request interface from Express
    interface Request {
      user: RequestUser;
    }
  }
}