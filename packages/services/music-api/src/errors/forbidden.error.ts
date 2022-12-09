import { HttpException, HttpStatus } from '@nestjs/common';
import { HTTP_PARAMS_PERMISSION_ERROR_DEFAULT } from 'constants/text.constant';

/**
 * @class HttpForbiddenError
 * @classdesc 403 -> forbidden
 * @example new HttpForbiddenError('error message')
 * @example new HttpForbiddenError(new Error())
 */
export class HttpForbiddenError extends HttpException {
  constructor(error?: any) {
    super(error || HTTP_PARAMS_PERMISSION_ERROR_DEFAULT, HttpStatus.FORBIDDEN);
  }
}
