import { describe, expect, it, vi } from 'vitest';
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
    it('주어진 값으로 상태를 바꾼다.', () => {
      const s = sangtae('Lee');

      s.set('Kim');

      expect(s.get()).toEqual('Kim');
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
    it('set을 호출하면 현재 상태와 함께 등록한 콜백 함수를 호출한다.', () => {
      const s = sangtae('Lee');
      const callback = vi.fn();

      s.subscribe(callback);
      s.set('Kim');

      expect(callback).toBeCalledWith('Kim');
    });

    it('set을 호출한 만큼 등록한 콜백 함수를 호출한다.', () => {
      const s = sangtae('Lee');
      const callback = vi.fn();

      s.subscribe(callback);
      s.set('Kim');
      s.set('Park');
      s.set('Jung');
      s.set('Choi');
      s.set('Kang');

      expect(callback).toBeCalledTimes(5);
    });

    it('리턴한 함수 "unsubscribe"를 호출하면 더 이상 콜백을 호출하지 않는다.', () => {
      const s = sangtae('Lee');
      const callback = vi.fn();

      const unsubscribe = s.subscribe(callback);
      s.set('Kim');
      s.set('Park');
      s.set('Jung');

      unsubscribe();
      s.set('Choi');
      s.set('Kang');

      expect(callback).toBeCalledTimes(3);
    });

    it('같은 값으로 변경한 경우, 콜백 함수를 호출하지 않는다.', () => {
      const s = sangtae('Lee');
      const callback = vi.fn();

      s.subscribe(callback);
      s.set('Lee');
      s.set('Lee');
      s.set('Lee');
      s.set('Lee');
      s.set('Lee');

      expect(callback).not.toBeCalled();
    });

    it('기존 배열을 직접 수정해서 set을 호출한 경우, 콜백 함수를 호출하지 않는다.', () => {
      const arr = ['Lee', 'Kim', 'Park', 'Jung'];
      const s = sangtae(arr);
      const callback = vi.fn();

      s.subscribe(callback);
      arr.push('Choi');
      s.set(arr);

      expect(callback).not.toBeCalled();
    });

    it('기존 객체를 직접 수정해서 set을 호출한 경우, 콜백 함수를 호출하지 않는다.', () => {
      const obj = { firstName: 'Hyanggi', lastName: 'Lee' };
      const s = sangtae(obj);
      const callback = vi.fn();

      s.subscribe(callback);
      obj.lastName = 'Kim';
      s.set(obj);

      expect(callback).not.toBeCalled();
    });

    it('콜백 함수를 2개 이상 등록할 수 있다.', () => {
      const s = sangtae('Lee');
      const callbacks = [vi.fn(), vi.fn(), vi.fn(), vi.fn()];

      callbacks.forEach((callback) => s.subscribe(callback));
      s.set('Kim');

      callbacks.forEach((callback) => expect(callback).toBeCalled());
    });
  });
});
