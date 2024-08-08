import { describe, expect, it, vi } from 'vitest';
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

      s.set(10);

      expect(c.get()).toEqual(10);
    });

    it('상태가 변경되면, 변경된 상태에 selector를 적용한 값을 리턴한다.', () => {
      const s = sangtae(0);
      const c = computed(s, (v) => v + 5);

      s.set(10);

      expect(c.get()).toEqual(15);
    });
  });

  describe('subscribe', () => {
    it('상태가 변경되면, 등록한 콜백 함수를 호출한다.', () => {
      const s = sangtae(0);
      const c = computed(s, (v) => v + 5);
      const callback = vi.fn();

      c.subscribe(callback);
      s.set(1);

      expect(callback).toBeCalled();
    });

    it('set을 호출한 만큼 등록한 콜백 함수를 호출한다.', () => {
      const s = sangtae(0);
      const c = computed(s, (v) => v + 5);
      const callback = vi.fn();

      c.subscribe(callback);
      s.set(1);
      s.set(2);
      s.set(3);
      s.set(4);
      s.set(5);

      expect(callback).toBeCalledTimes(5);
    });

    it('리턴한 함수 "unsubscribe"를 호출하면 더 이상 콜백을 호출하지 않는다.', () => {
      const s = sangtae(0);
      const c = computed(s, (v) => v + 5);
      const callback = vi.fn();

      const unsubscribe = c.subscribe(callback);
      s.set(1);
      s.set(2);
      s.set(3);

      unsubscribe();
      s.set(4);
      s.set(5);

      expect(callback).toBeCalledTimes(3);
    });
  });
});
