import { Injectable, Inject } from '@nestjs/common';
import { IBcrypt } from './bcrypt.module';
import { constraints } from './constraints';

export interface IBcryptService {
  hash(plainText: string, salt: number | string): Promise<string>;
  compare(platinText: string, hash: string): Promise<boolean>;
  genSalt(rounds: number): Promise<string>;
}

@Injectable()
export class BcryptService implements IBcryptService {
  constructor(@Inject(constraints.bcrypt) private readonly bcrypt: IBcrypt) {}

  hash(plainText: string, salt: string | number): Promise<string> {
    return this.bcrypt.hash(plainText, salt);
  }

  compare(plainText: string, hash: string): Promise<boolean> {
    return this.bcrypt.compare(plainText, hash);
  }

  genSalt(rounds: number): Promise<string> {
    return this.bcrypt.genSalt(rounds);
  }
}
