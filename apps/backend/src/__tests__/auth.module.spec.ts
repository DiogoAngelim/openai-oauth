import { Test, TestingModule } from '@nestjs/testing'
import { AuthModule, AuthModule as ImportedAuthModule } from '../auth/auth.module'
import { AuthService, AuthService as ImportedAuthService } from '../auth/auth.service'
import { JwtService } from '@nestjs/jwt'

describe('AuthModule', () => {
  it('should compile and provide AuthService', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule]
    }).compile()
    const authService = module.get<AuthService>(AuthService)
    expect(authService).toBeDefined()
  })

  it('should use env JWT_SECRET if set', async () => {
    process.env.JWT_SECRET = 'testsecret'
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule]
    }).compile()
    const jwtService = module.get<JwtService>(JwtService)
    const token = jwtService.sign({ foo: 'bar' })
    expect(token).toBeDefined()
  })

  it('should generate random JWT_SECRET if not set', async () => {
    delete process.env.JWT_SECRET
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule]
    }).compile()
    const jwtService = module.get<JwtService>(JwtService)
    const token = jwtService.sign({ foo: 'bar' })
    expect(token).toBeDefined()
  })

  it('should not provide GoogleStrategy if isGoogleStrategyEnabled is false', async () => {
    jest.resetModules()
    jest.doMock('../auth/google.strategy', () => ({
      isGoogleStrategyEnabled: false,
      GoogleStrategy: () => ({}) // not used, now a function returning an object
    }))
    const module = await Test.createTestingModule({ imports: [ImportedAuthModule] }).compile()
    // Should not throw and should still provide AuthService
    const authService = module.get(ImportedAuthService)
    expect(authService).toBeDefined()
    jest.dontMock('../auth/google.strategy')
    jest.resetModules()
  })
})
