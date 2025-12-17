import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import {Like} from './like.entity'


@Entity('murmurs')
export class Murmur {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: 0 })
  likeCount: number;

  // Relationships
  @ManyToOne(() => User, user => user.murmurs, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Like, like => like.murmur)
  likes: Like[];
}