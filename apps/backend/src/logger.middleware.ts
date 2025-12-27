import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getLogger } from './logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger: { info: (message: string, method: string, url: string, status: number, duration: number) => void };
  constructor(loggerInstance?: { info: (message: string, method: string, url: string, status: number, duration: number) => void }) {
    this.logger = loggerInstance || getLogger();
  }
  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      this.logger.info('%s %s %d %dms', req.method, req.originalUrl, res.statusCode, duration);
    });
    next();
  }
}
