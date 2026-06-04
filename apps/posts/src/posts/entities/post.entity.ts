import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DatabaseIndexType } from '@app/shared/enums/database-index-type.enum';
import { PostStatusEnum } from '@app/shared/enums/post-status.enum';
import { TableNamesEnum } from '@app/shared/enums/table-names.enum';
import { IPost } from '@app/shared/interfaces/post/post.interface';

@Entity(TableNamesEnum.POSTS_POSTS)
@Index(`${DatabaseIndexType.IDX}_${TableNamesEnum.POSTS_POSTS}_userId_status_createdAt`, [
  'userId',
  'status',
  'createdAt',
])
export class Post implements IPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 140 })
  content: string;

  @Column('json')
  tags: string[];

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
