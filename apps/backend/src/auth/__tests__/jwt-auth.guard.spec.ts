import 'jest'
import 'reflect-metadata'
import { JwtAuthGuard } from '../jwt-auth.guard'
// import { ExecutionContext } from '@nestjs/common';

describe('JwtAuthGuard', () => {
  it('should be defined', () => {
    expect(JwtAuthGuard).toBeDefined()
  })
  it('should extend AuthGuard', () => {
    const guard = new JwtAuthGuard()
    expect(guard).toBeInstanceOf(JwtAuthGuard)
  })
})
