import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Murmur } from './murmur.entity' ;
import { Follow } from './follow.entity' ;
import { Like } from './like.entity' ;
import { Session } from './session.entity'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string; // Storing hashed password

  @Column({ default: 'Hello World!' })
  bio: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // Relationships
  @OneToMany(() => Murmur, murmur => murmur.user)
  murmurs: Murmur[];

  @OneToMany(() => Follow, follow => follow.follower)
  following: Follow[];

  @OneToMany(() => Follow, follow => follow.followed)
  followers: Follow[];

  @OneToMany(() => Like, like => like.user)
  likes: Like[];

  @OneToMany(() => Session, session => session.user)
  sessions: Session[];
}