import { HttpException, HttpStatus } from '@nestjs/common';

export class EntityNotCreatedException extends HttpException {
  constructor() {
    super('The requested entity was not created', HttpStatus.BAD_REQUEST);
  }
}
