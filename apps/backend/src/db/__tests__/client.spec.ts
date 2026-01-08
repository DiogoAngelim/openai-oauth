import { db } from '../client'
describe('db client', () => {
  it('should be undefined for build isolation', () => {
    expect(db).toBeUndefined()
  })
})
