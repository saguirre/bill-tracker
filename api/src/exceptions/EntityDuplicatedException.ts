import { HttpException, HttpStatus } from '@nestjs/common';

export class EntityNotCreatedException extends HttpException {
  constructor() {
    super(
      'The requested entity already exists or is in conflict',
      HttpStatus.CONFLICT,
    );
  }
}
