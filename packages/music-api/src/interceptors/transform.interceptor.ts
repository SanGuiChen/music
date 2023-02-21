import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { CustomError } from 'errors/custom.error';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';

export interface IResponse<T> {
  code: number;
  data: T;
  message: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, IResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse<T> | never> {
    return next.handle().pipe(
      timeout(5000),
      map((data) => ({
        code: 200,
        data,
        message: 'success',
      })),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(new RequestTimeoutException('Service timeout'));
        }
        return throwError(new CustomError('Unknown error the service side'));
      }),
    );
  }
}
