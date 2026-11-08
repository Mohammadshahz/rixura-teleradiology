import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): {} {
    return { welcome: 'Hello from Radiology Service!' };
  }
}
