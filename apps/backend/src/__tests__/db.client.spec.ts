import * as dbClient from '../db/client';

describe('db client', () => {
  it('should export a db instance', () => {
    expect(dbClient).toHaveProperty('db');
    expect(typeof dbClient.db).toBe('object');
  });
});
