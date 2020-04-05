# @sloang/bcrypt-module

## Purpose
The purpose of this module is to make bcrypt a injectable service. Bcrypt is the go to for one way password hashing, however, the best versions for node.js (bcrypt and bcryptjs) are created with standard JavaScript as objects and not classes. Because of this every time bcrypt is used inside nestjs it has to be imported using import * from. This becomes strange for testing as one is forced to mock bcrypt which is outside the injection system. This package solves this issue by exposing bcrypt as a service class. The service class acts as a class wrapper around the three main bcrypt function hash, compare and genSalt. If the default service is not sufficient for a use case then it can be overridden with a custom service. This package will work with bcrypt, bcryptjs and any other package with the same method signature for the three main functions mentioned.

## Installation

1. Install bcrypt lib of choice
2. Install bcrypt lib typings
3. Install this package

```bash
npm install bcrypt @types/bcrypt @sloang/bcrypt-module
```

## Usage

The vast majority of use cases will use the standard way of implementing this lib
```ts
import { Module } from '@nestjs/common';
import { BcryptModule } from '@sloang/bcrypt-module';
import * as bcrypt from 'bcrypt'

@Module({
  imports: [BcryptModule.forFeature({bcrypt})]
})
export class AppModule {}

```
Doing this will expose a BcryptService for the scope of that module to use. Use by injecting the service using the constraints object

```ts
import { constraints, IBcryptService } from "@sloang/bcrypt-module";
import { Inject } from '@nestjs/common';

@Controller('/')
export class AppControler {
  constructor(
      @Inject(constraints.bcryptService) private readonly bcryptService: IBcryptService
  ) {}

  @Post('hash')
  hash(@Body('string') str: string) {
      return this.bcryptService.hash(str, 10)
  }

  @Post('compare')
  compare(@Body('string') str: string, @Body('hash') hash: string) {
      return this.bcryptService.compare(str, hash)
  }

  @Post('genSalt')
  genSalt(@Body('rounds') rounds: number) {
      return this.bcryptService.genSalt(rounds)
  }
}
```

This module takes in 2 options bcrypt and bcryptService. Bcrypt is required and is the bcrypt library you wish to use and the other is optional. If the default BcryptService does not meet your needs you can override it by injecting your own into the options using the bcryptService key. Inside you can reference the injected bcrypt instance like so:

```ts
import { Injectable, Inject } from '@nestjs/common';
import { constraints } from "@sloang/bcrypt-module";
@Injectable()
export class BcryptService implements IBcryptService {
    constructor(
        @Inject(constraints.bcrypt) private readonly bcrypt: IBcrypt
    ) {}

    hash(plainText: string, salt: string | number): Promise<string> {
        return this.bcrypt.hash(plainText, salt)
    }

    compare(plainText: string, hash: string): Promise<boolean> {
        return this.bcrypt.compare(plainText, hash)
    }

    genSalt(rounds: number): Promise<string> {
        return this.bcrypt.genSalt(rounds)
    }

}
```

## API

* Module Options
    * bcrypt (required) - The bcrypt lib you are using
    * bcryptService (optional) - a custom service to override the default injected service
* BcryptService
    * hash(plainText: string, salt: string | number) returns the hash in a promise
    * compare(plainText: string, hash: string) returns true or false in a promise depending on if the plainText string relates to the hash
    * genSalt(rounds: number) returns the salt string in a promise

## Change Log

See [Changelog](https://github.com/sloanbgwaltney/-sloang-bcrypt-module/blob/master/CHANGELOG.md) for more information.

## Contributing

Contributions welcome! See [Contributing](https://github.com/sloanbgwaltney/-sloang-bcrypt-module/blob/master/CONTRIBUTING.md).

## Author

**Sloan Gwaltney**

## License

Licensed under the MIT License - see the [LICENSE](https://github.com/sloanbgwaltney/-sloang-bcrypt-module/blob/master/LICENSE) file for details.