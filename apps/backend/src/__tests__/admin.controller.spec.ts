// Mock NestJS decorators and guards to bypass them in tests
import { AdminController } from "../admin.controller";

jest.mock("@nestjs/common", () => ({
  Controller: () => () => {},
  Get: () => () => {},
  UseGuards: () => () => {},
}));
jest.mock("../auth/jwt-auth.guard", () => ({
  JwtAuthGuard: jest.fn(),
}));
jest.mock("../auth/roles.guard", () => ({
  RolesGuard: jest.fn(),
  Roles: () => () => {},
}));

describe("AdminController", () => {
  let controller: AdminController;

  beforeEach(() => {
    controller = new AdminController();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
  it("should return admin dashboard status", () => {
    const result = controller.dashboard();
    expect(result).toEqual({ status: "Admin dashboard (stub)" });
  });
});
