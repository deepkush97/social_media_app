import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  private readonly SALT_ROUNDS = 10;

  async hash(input: string): Promise<string> {
    return await bcrypt.hash(input, this.SALT_ROUNDS);
  }

  async validate(input: string, comparer: string): Promise<boolean> {
    return bcrypt.compare(input, comparer);
  }
}
