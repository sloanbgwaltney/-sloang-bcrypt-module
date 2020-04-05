import { Module, Provider } from '@nestjs/common';
import { DynamicModule } from '@nestjs/common';
import { IBcryptService, BcryptService } from './bcrypt.service';
import { constraints } from './constraints';

export type Newable<E> = new (...args: any[]) => E;
export type ICallback<E, K> = (err: E, result: K) => void;

export interface IBcrypt {
  hash(plainText: string, salt: number | string): Promise<string>;
  compare(plainText: string, hash: string): Promise<boolean>;
  genSalt(rounds: number): Promise<string>;
}

export interface IBcryptModuleOptions {
  bcrypt: IBcrypt;
  bcryptService?: Newable<IBcryptService>;
}

@Module({})
export class BcryptModule {
  static forFeature(options: IBcryptModuleOptions): DynamicModule {
    const providers: Provider<any>[] = [
      { provide: constraints.bcrypt, useValue: options.bcrypt },
    ];
    const exports = [];

    if (options.bcryptService) {
      providers.push({
        provide: constraints.bcryptService,
        useClass: options.bcryptService,
      });
      exports.push(providers[1]);
    } else {
      providers.push({
        provide: constraints.bcryptService,
        useClass: BcryptService,
      });
      exports.push(providers[1]);
    }

    return {
      module: BcryptModule,
      providers,
      exports,
    };
  }
}
