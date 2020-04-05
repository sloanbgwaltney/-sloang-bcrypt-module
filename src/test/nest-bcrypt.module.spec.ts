import { IBcryptModuleOptions, BcryptModule } from '../bcrypt.module';
import * as bcrypt from 'bcrypt';
import { BcryptService } from '../bcrypt.service';
import { TestingModule, Test } from '@nestjs/testing';
import { constraints } from '../constraints';
import { TestBcryptService } from './test-bcrypt.service';

describe('NestBcryptModule', () => {
  it('Complies with bcrypt', async () => {
    const options: IBcryptModuleOptions = { bcrypt };
    const module: TestingModule = await Test.createTestingModule({
      imports: [BcryptModule.forFeature(options)],
    }).compile();
    expect(module).toBeDefined();
    const bcryptInstance = module.get(constraints.bcrypt);
    const service = module.get(constraints.bcryptService);
    expect(bcryptInstance).toEqual(bcrypt);
    expect(service).toBeInstanceOf(BcryptService);
  });

  it('Complies with custom service', async () => {
    const options: IBcryptModuleOptions = {
      bcrypt,
      bcryptService: TestBcryptService,
    };
    const module: TestingModule = await Test.createTestingModule({
      imports: [BcryptModule.forFeature(options)],
    }).compile();
    expect(module).toBeDefined();
    const bcryptInstance = module.get(constraints.bcrypt);
    expect(bcryptInstance).toEqual(bcrypt);
    const service = module.get(constraints.bcryptService);
    expect(service).toBeInstanceOf(TestBcryptService);
  });
});
