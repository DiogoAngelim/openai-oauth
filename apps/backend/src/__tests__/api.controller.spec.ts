import { ApiController } from '../api/api.controller'

describe('ApiController', () => {
  let controller: ApiController

  beforeEach(() => {
    controller = new ApiController()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
  it('should return user info for /me', async () => {
    const req = { user: { orgId: 'org1', role: 'USER', foo: 'bar' } }
    const result = await controller.me(req)
    expect(result).toEqual({ user: req.user, orgId: 'org1', role: 'USER' })
  })

  it('should return admin message for /admin', async () => {
    const req = { user: { orgId: 'org1', role: 'ADMIN', foo: 'bar' } }
    const result = await controller.adminOnly(req)
    expect(result).toEqual({ message: 'Admin/Owner access granted', user: req.user })
  })
})
