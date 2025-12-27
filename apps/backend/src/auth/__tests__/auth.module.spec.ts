import 'jest';
import { AuthModule } from '../auth.module';
import { GoogleStrategy, isGoogleStrategyEnabled } from '../google.strategy';

describe('AuthModule', () => {
  it('should be defined', () => {
    expect(AuthModule).toBeDefined();
  });
  it('should conditionally provide GoogleStrategy', () => {
    if (isGoogleStrategyEnabled) {
      // @ts-expect-error: Provider type does not have 'name'
      expect(GoogleStrategy.name).toBe('GoogleStrategyClass');
    } else {
      // @ts-expect-error: Provider type does not have 'name'
      expect(GoogleStrategy.name).toBe('DummyGoogleStrategy');
    }
  });
});
