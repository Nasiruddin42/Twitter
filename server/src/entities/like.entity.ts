import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { User } from './user.entity';
import { Murmur } from './murmur.entity';

@Entity('likes')
@Unique(['user', 'murmur']) // Ensures a user can only like a murmur once
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  // Relationships
  @ManyToOne(() => User, user => user.likes, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Murmur, murmur => murmur.likes, { onDelete: 'CASCADE' })
  murmur: Murmur;
}