import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status = exception.getStatus?.() ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const response = exception.getResponse();

    let message: string;
    let error: string | undefined;

    if (typeof response === 'string') {
      message = response;
    } else if (typeof response === 'object' && response !== null) {
      const r: any = response;
      message = Array.isArray(r.message) ? r.message.join(', ') : r.message;
      error = r.error;
    } else {
      message = 'Unexpected error';
    }

    res.status(status).json({
      data: {
        statusCode: status,
        message,
        error,
        path: req.url,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
