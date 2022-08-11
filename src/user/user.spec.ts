import { User } from './user';

describe('User', () => {
  it('should be defined', () => {
    expect(new User('bard', 18)).toBeDefined();
  });
});
