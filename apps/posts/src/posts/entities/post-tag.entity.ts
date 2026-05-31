import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { TableNamesEnum } from '@app/shared/enums/table-names.enum';

@Entity(TableNamesEnum.POSTS_POST_TAGS)
@Unique(['postId', 'tagId'])
export class PostTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  postId: number;

  @Column({ type: 'int' })
  tagId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
