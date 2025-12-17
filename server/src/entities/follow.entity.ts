import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { User } from './user.entity';

@Entity('follows')
@Unique(['follower', 'followed']) // Ensures a user can only follow another user once
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  // Relationships
  @ManyToOne(() => User, user => user.following, { onDelete: 'CASCADE' })
  follower: User;

  @ManyToOne(() => User, user => user.followers, { onDelete: 'CASCADE' })
  followed: User;
}