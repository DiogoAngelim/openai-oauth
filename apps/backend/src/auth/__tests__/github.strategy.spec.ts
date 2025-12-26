import { GithubStrategy } from '../github.strategy';
import { AuthService } from '../auth.service';

describe('GithubStrategy', () => {
  let strategy: GithubStrategy;
  let authService: AuthService;

  beforeEach(() => {
    authService = { validateOAuthLogin: jest.fn().mockResolvedValue('user') } as any;
    strategy = new GithubStrategy(authService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should call validateOAuthLogin and done', async () => {
    const profile = { emails: [{ value: 'test@example.com' }], displayName: 'Test User' };
    const done = jest.fn();
    await strategy.validate('token', 'refresh', profile, done);
    expect(authService.validateOAuthLogin).toHaveBeenCalledWith(profile);
    expect(done).toHaveBeenCalledWith(null, 'user');
  });
});

process.env.GITHUB_CLIENT_ID = 'test-id';
process.env.GITHUB_CLIENT_SECRET = 'test-secret';
process.env.BACKEND_URL = 'http://localhost:4000';
