import { describe, expect, it } from 'vitest';
import { sleep } from './util.ts';
import { sangtae } from './sangtae.ts';
import { computed } from './computed.ts';

describe('computed', () => {
  describe('get', () => {
    it('selector로 v => v + 5가 주어지면, 상태에 5를 더한 값을 리턴한다.', () => {
      const s = sangtae(0);
      const c = computed(s, (v) => v + 5);

      expect(c.get()).toEqual(5);
    });

    it('selector로 () => 10이 주어지면, 상태에 상관 없이 10을 리턴한다.', () => {
      const s = sangtae(0);
      const c = computed(s, () => 10);

      expect(c.get()).toEqual(10);
    });

    it('상태가 변경되면, 변경된 상태에 selector를 적용한 값을 리턴한다.', async () => {
      const s = sangtae(0);
      const c = computed(s, (v) => v + 5);

      s.set(10);
      await sleep(100);

      expect(c.get()).toEqual(15);
    });
  });
});
