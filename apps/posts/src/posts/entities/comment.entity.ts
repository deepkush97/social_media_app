import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ContentStatusEnum } from '@app/shared/enums/content-status.enum';
import { DatabaseIndexType } from '@app/shared/enums/database-index-type.enum';
import { TableNamesEnum } from '@app/shared/enums/table-names.enum';
import { IComment } from '@app/shared/interfaces/comment/comment.interface';

@Entity(TableNamesEnum.POSTS_COMMENTS)
@Index(`${DatabaseIndexType.IDX}_${TableNamesEnum.POSTS_COMMENTS}_postId_status_createdAt`, [
  'postId',
  'status',
  'createdAt',
])
@Index(`${DatabaseIndexType.IDX}_${TableNamesEnum.POSTS_COMMENTS}_userId`, ['userId'])
export class Comment implements IComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  postId: number;

  @Column({ type: 'int' })
  userId: number;

  @Column({ nullable: true, type: 'int' })
  parentId: number | null;

  @Column({ length: 1000 })
  content: string;

  @Column({ enum: ContentStatusEnum, type: 'enum', default: ContentStatusEnum.ACTIVE })
  status: ContentStatusEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
