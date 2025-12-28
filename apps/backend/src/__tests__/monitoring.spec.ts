import { registry } from '../monitoring'

describe('monitoring registry', () => {
  it('should be defined', () => {
    expect(registry).toBeDefined()
  })
  it('should have metrics method', () => {
    expect(typeof registry.metrics).toBe('function')
  })
})
