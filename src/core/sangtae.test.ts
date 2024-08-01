import { describe, expect, it } from 'vitest';
import { sangtae } from './sangtae.ts';

describe('sangtae', () => {
  describe('get', () => {
    it('초기값으로 0이 주어지면, 0을 리턴한다.', () => {
      const initialState = 0;

      const s = sangtae(initialState);

      expect(s.get()).toEqual(initialState);
    });

    it('초기값으로 "sangtae"가 주어지면, "sangtae"를 리턴한다.', () => {
      const initialState = 'sangtae';

      const s = sangtae(initialState);

      expect(s.get()).toEqual(initialState);
    });

    it('초기값으로 [1, 3, 5, 4]가 주어지면, [1, 3, 5, 4]를 리턴한다.', () => {
      const initialState = [1, 3, 5, 4];

      const s = sangtae(initialState);

      expect(s.get()).toEqual(initialState);
    });

    it('초기값으로 {firstName: "Hyanggi", lastName: "Lee"}가 주어지면, {firstName: "Hyanggi", lastName: "Lee"}를 리턴한다.', () => {
      const initialState = { firstName: 'Hyanggi', lastName: 'Lee' };

      const s = sangtae(initialState);

      expect(s.get()).toEqual(initialState);
    });
  });
});
