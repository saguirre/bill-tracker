import { HttpException, HttpStatus } from '@nestjs/common';

export class EntityNotFoundException extends HttpException {
  constructor() {
    super('The email or password are incorrect', HttpStatus.UNAUTHORIZED);
  }
}
