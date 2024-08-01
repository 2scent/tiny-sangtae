import { describe, expect, it, vi } from 'vitest';
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

  describe('set', () => {
    it('3과 함께 호출하면, 값을 3으로 바꾼다.', () => {
      const s = sangtae(0);

      s.set(3);

      expect(s.get()).toEqual(3);
    });

    it('prev => prev + 1와 함께 호출하면, 이전 값에서 1을 더한다.', () => {
      const s = sangtae(3);

      s.set((prev) => prev + 1);

      expect(s.get()).toEqual(4);
    });

    it('prev => prev - 5와 함께 호출하면, 이전 값에서 5를 뺀다.', () => {
      const s = sangtae(3);

      s.set((prev) => prev - 5);

      expect(s.get()).toEqual(-2);
    });
  });

  describe('subscribe', () => {
    it('set을 호출한 만큼 등록한 콜백 함수를 호출한다.', () => {
      const s = sangtae(0);
      const callback = vi.fn();

      s.subscribe(callback);
      s.set(1);
      s.set(2);
      s.set(3);
      s.set(4);
      s.set(5);

      expect(callback).toBeCalledTimes(5);
    });

    it('같은 값으로 변경한 경우, 콜백 함수를 호출하지 않는다.', () => {
      const s = sangtae(0);
      const callback = vi.fn();

      s.subscribe(callback);
      s.set(0);
      s.set(0);
      s.set(0);
      s.set(0);
      s.set(0);

      expect(callback).not.toBeCalled();
    });

    it('콜백 함수를 2개 이상 등록할 수 있다.', () => {
      const s = sangtae(0);
      const callbacks = [vi.fn(), vi.fn(), vi.fn(), vi.fn()];

      callbacks.forEach((callback) => s.subscribe(callback));
      s.set(1);
      s.set(2);
      s.set(3);
      s.set(4);
      s.set(5);

      callbacks.forEach((callback) => expect(callback).toBeCalledTimes(5));
    });

    it('리턴한 함수 "unsubscribe"를 호출하면 더 이상 콜백을 호출하지 않는다.', () => {
      const s = sangtae(0);
      const callback = vi.fn();

      const unsubscribe = s.subscribe(callback);
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
