import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AuthSessionEnum } from '@app/shared/enums/auth-session.enum';
import { DatabaseIndexType } from '@app/shared/enums/database-index-type.enum';
import { ISession } from '@app/shared/interfaces/session/session.interface';

@Entity('sessions')
export class Session implements ISession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', generated: 'uuid' })
  @Index(`${DatabaseIndexType.IDX}_sessions_guid`)
  guid: string;

  @Column({ enum: AuthSessionEnum, type: 'enum' })
  status: AuthSessionEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ name: 'userId' })
  userId: number;
}
