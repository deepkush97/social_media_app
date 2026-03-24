import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { AuthSessionEnum } from '@app/shared/enums/auth-session.enum';
import { ISession } from '@app/shared/interfaces/session/session.interface';

import { Session } from './entities/session.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async createNewSession(userId: number): Promise<ISession> {
    const newSession = this.sessionRepository.create({
      userId: userId,
      status: AuthSessionEnum.OPEN,
    });
    const session = await this.sessionRepository.save(newSession);
    return session;
  }

  async findOpenSessionByGuid(guid: string): Promise<ISession | null> {
    const session = await this.sessionRepository.findOne({
      where: { guid, status: AuthSessionEnum.OPEN },
    });

    return session;
  }

  async closeAllSession(userId: number): Promise<boolean> {
    await this.sessionRepository.update(
      { userId, status: AuthSessionEnum.OPEN },
      { status: AuthSessionEnum.CLOSED },
    );

    return true;
  }

  async closeSession(guid: string): Promise<boolean> {
    await this.sessionRepository.update({ guid }, { status: AuthSessionEnum.CLOSED });

    return true;
  }
}
