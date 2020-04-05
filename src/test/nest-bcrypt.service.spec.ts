import { Test, TestingModule } from '@nestjs/testing';
import { IBcryptService } from '../bcrypt.service';
import { BcryptModule, IBcryptModuleOptions } from '../bcrypt.module';
import * as bcrypt from 'bcrypt';
import { constraints } from '../constraints';

describe('NestBcryptService', () => {
  let service: IBcryptService;

  beforeEach(async () => {
    const bcryptOptions: IBcryptModuleOptions = {
      bcrypt,
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [BcryptModule.forFeature(bcryptOptions)],
    }).compile();

    service = module.get<IBcryptService>(constraints.bcryptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should be able to return bcrypt hash result', async () => {
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementationOnce((data, rounds) => Promise.resolve('test'));
    const res = await service.hash('test', 10);
    expect(res).toEqual('test');
  });

  it('Should be able to return any error from bcrypt hash', async () => {
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementationOnce((data, rounds) =>
        Promise.reject(new Error('test')),
      );
    try {
      await service.hash('', 10);
      fail('Failed to throw error');
    } catch (e) {
      expect(e.message).toEqual('test');
    }
  });

  it('Should be able to return bcrypt comapre result', async () => {
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementationOnce((plain, hash) => Promise.resolve(false));
    const res = await service.compare('res', 'res');
    expect(res).toBe(false);
  });

  it('Should be able to return any error from bcrypt compare', async () => {
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementationOnce((str1, str2) =>
        Promise.reject(new Error('test')),
      );
    try {
      await service.compare('', '');
      fail('Failed to throw error');
    } catch (e) {
      expect(e.message).toEqual('test');
    }
  });

  it('Should be able to return the generated salt from bcrypt', async () => {
    jest
      .spyOn(bcrypt, 'genSalt')
      .mockImplementationOnce((rounds) => Promise.resolve('test'));
    const res = await service.genSalt(10);
    expect(res).toEqual('test');
  });

  it('Should be able to return any error from bcrypt genSalt', async () => {
    jest
      .spyOn(bcrypt, 'genSalt')
      .mockImplementationOnce((num) => Promise.reject(new Error('test')));
    try {
      await service.genSalt(10);
      fail('Failed to throw error');
    } catch (e) {
      expect(e.message).toEqual('test');
    }
  });
});
