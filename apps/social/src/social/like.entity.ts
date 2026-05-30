import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { DatabaseIndexType } from '@app/shared/enums/database-index-type.enum';
import { TableNamesEnum } from '@app/shared/enums/table-names.enum';
import { ILike } from '@app/shared/interfaces/like/like.interface';

@Entity(TableNamesEnum.SOCIAL_LIKES)
@Unique(`${DatabaseIndexType.UNQ}_${TableNamesEnum.SOCIAL_LIKES}_userId_postId`, [
  'userId',
  'postId',
])
export class LikeEntity implements ILike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  @Index(`${DatabaseIndexType.IDX}_${TableNamesEnum.SOCIAL_LIKES}_postId`)
  postId: number;

  @Column({ type: 'int' })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
