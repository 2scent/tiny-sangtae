import { describe, expect, it, vi } from 'vitest';
import { sleep } from './util.ts';
import { sangtae } from './sangtae.ts';

describe('sangtae', () => {
  describe('get', () => {
    it('초기값으로 수가 주어지면, 동일한 수를 리턴한다.', () => {
      const initialState = 0;

      const s = sangtae(initialState);

      expect(s.get()).toEqual(initialState);
    });

    it('초기값으로 문자열이 주어지면, 동일한 문자열을 리턴한다.', () => {
      const initialState = 'sangtae';

      const s = sangtae(initialState);

      expect(s.get()).toEqual(initialState);
    });

    it('초기값으로 배열이 주어지면, 동일한 배열을 리턴한다.', () => {
      const initialState = [1, 3, 5, 4];

      const s = sangtae(initialState);

      expect(s.get()).toEqual(initialState);
    });

    it('초기값으로 객체가 주어지면, 동일한 객체를 리턴한다.', () => {
      const initialState = { firstName: 'Hyanggi', lastName: 'Lee' };

      const s = sangtae(initialState);

      expect(s.get()).toEqual(initialState);
    });
  });

  describe('set', () => {
    it('비동기적으로 값을 바꾼다.', async () => {
      const s = sangtae(0);

      s.set(3);

      expect(s.get()).toEqual(0);

      await sleep(100);

      expect(s.get()).toEqual(3);
    });

    it('수와 함께 호출하면, 값을 주어진 수로 바꾼다.', async () => {
      const s = sangtae(0);

      s.set(3);
      await sleep(100);

      expect(s.get()).toEqual(3);
    });

    it('prev => prev + 1와 함께 호출하면, 이전 값에서 1을 더한다.', async () => {
      const s = sangtae(3);

      s.set((prev) => prev + 1);
      await sleep(100);

      expect(s.get()).toEqual(4);
    });

    it('prev => prev - 5와 함께 호출하면, 이전 값에서 5를 뺀다.', async () => {
      const s = sangtae(3);

      s.set((prev) => prev - 5);
      await sleep(100);

      expect(s.get()).toEqual(-2);
    });
  });

  describe('subscribe', () => {
    it('set을 호출하면 등록한 콜백 함수를 호출한다.', async () => {
      const s = sangtae(0);
      const callback = vi.fn();

      s.subscribe(callback);
      s.set(1);
      await sleep(100);

      expect(callback).toBeCalled();
    });

    it('set을 연속적으로 호출하면 콜백 함수를 마지막 1번만 호출한다.', async () => {
      const s = sangtae(0);
      const callback = vi.fn();

      s.subscribe(callback);
      s.set(1);
      s.set(2);
      s.set(3);
      s.set(4);
      s.set(5);
      await sleep(100);

      expect(callback).toHaveBeenCalledOnce();
    });

    it('같은 값으로 변경한 경우, 콜백 함수를 호출하지 않는다.', async () => {
      const s = sangtae(0);
      const callback = vi.fn();

      s.subscribe(callback);
      s.set(0);
      s.set(0);
      s.set(0);
      s.set(0);
      s.set(0);
      await sleep(100);

      expect(callback).not.toBeCalled();
    });

    it('기존 배열을 직접 수정해서 set을 호출한 경우, 콜백 함수를 호출하지 않는다.', async () => {
      const arr = [0, 1, 2, 3];
      const s = sangtae(arr);
      const callback = vi.fn();

      s.subscribe(callback);
      arr.push(4);
      s.set(arr);
      await sleep(100);

      expect(callback).not.toBeCalled();
    });

    it('기존 객체를 직접 수정해서 set을 호출한 경우, 콜백 함수를 호출하지 않는다.', async () => {
      const obj = { firstName: 'Hyanggi', lastName: 'Lee' };
      const s = sangtae(obj);
      const callback = vi.fn();

      s.subscribe(callback);
      obj.lastName = 'Kim';
      s.set(obj);
      await sleep(100);

      expect(callback).not.toBeCalled();
    });

    it('콜백 함수를 2개 이상 등록할 수 있다.', async () => {
      const s = sangtae(0);
      const callbacks = [vi.fn(), vi.fn(), vi.fn(), vi.fn()];

      callbacks.forEach((callback) => s.subscribe(callback));
      s.set(1);
      await sleep(100);

      callbacks.forEach((callback) => expect(callback).toBeCalled());
    });

    it('리턴한 함수 "unsubscribe"를 호출하면 더 이상 콜백을 호출하지 않는다.', async () => {
      const s = sangtae(0);
      const callback = vi.fn();

      const unsubscribe = s.subscribe(callback);
      s.set(1);
      await sleep(100);

      unsubscribe();
      s.set(2);
      await sleep(100);

      expect(callback).toHaveBeenCalledOnce();
    });
  });
});
