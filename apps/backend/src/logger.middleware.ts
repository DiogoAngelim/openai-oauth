import { Injectable } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { getLogger } from './logger'

@Injectable()
export class LoggerMiddleware {
  constructor (private readonly logger = getLogger()) { }

  use (req: Request, res: Response, next: NextFunction): void {
    const start = Date.now()
    res.on('finish', () => {
      const duration = Date.now() - start
      this.logger.info(
        '%s %s %d %dms',
        req.method,
        req.originalUrl,
        res.statusCode,
        duration
      )
    })
    next()
  }
}
