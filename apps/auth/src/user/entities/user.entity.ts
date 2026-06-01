import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { DatabaseIndexType } from '@app/shared/enums/database-index-type.enum';
import { TableNamesEnum } from '@app/shared/enums/table-names.enum';
import { IUser } from '@app/shared/interfaces/user/users.interface';

@Entity(TableNamesEnum.AUTH_USERS)
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 150 })
  @Unique(`${DatabaseIndexType.UNQ}_${TableNamesEnum.AUTH_USERS}_email`, ['email'])
  email: string;

  @Column({ select: false, length: 200 })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
