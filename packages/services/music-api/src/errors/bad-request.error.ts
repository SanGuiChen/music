import { HttpException, HttpStatus } from '@nestjs/common';
import { HTTP_BAD_REQUEST_TEXT_DEFAULT } from 'constants/text.constant';

/**
 * @class HttpBadRequestError
 * @classdesc 400 -> bad request
 * @example new HttpBadRequestError('error message')
 * @example new HttpBadRequestError(new Error())
 */
export class HttpBadRequestError extends HttpException {
  constructor(error?: any) {
    super(error || HTTP_BAD_REQUEST_TEXT_DEFAULT, HttpStatus.BAD_REQUEST);
  }
}
