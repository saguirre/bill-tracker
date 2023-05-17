import { HttpException, HttpStatus } from '@nestjs/common';

export class EntityNotFoundException extends HttpException {
  constructor() {
    super('Entity Not Found', HttpStatus.NOT_FOUND);
  }
}
