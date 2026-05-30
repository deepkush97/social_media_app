import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PostStatusEnum } from '@app/shared/enums/post-status.enum';
import { IPost } from '@app/shared/interfaces/post/post.interface';

@Entity('posts')
export class Post implements IPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 140 })
  content: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  image?: string;

  @Column({ type: 'int' })
  userId: number;

  @Column({ enum: PostStatusEnum, type: 'enum', default: PostStatusEnum.ACTIVE })
  status: PostStatusEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
