import 'jest';
import logger from '../logger';

describe('logger', () => {
  it('should be defined', () => {
    expect(logger).toBeDefined();
  });
  it('should have info method', () => {
    expect(typeof logger.info).toBe('function');
  });
  it('should have error method', () => {
    expect(typeof logger.error).toBe('function');
  });
});
