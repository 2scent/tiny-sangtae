import { describe, expect, it, vi } from 'vitest';
import { sangtae } from './sangtae.ts';
import { action } from './action.ts';
import { computed } from './computed.ts';

describe('action', () => {
  it('action에서 set을 연속적으로 호출하면, 콜백 함수를 마지막 한 번만 호출한다.', () => {
    const s = sangtae('안녕');
    const callback = vi.fn();
    s.subscribe(callback);

    action(() => {
      s.set('안녕하세요');
      s.set('hi');
      s.set('hello');
    });

    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith('hello');
  });

  it('여러 action으로 나눠서 set을 호출할 경우, action 수만큼 콜백 함수를 호출한다.', () => {
    const s = sangtae('안녕');
    const callback = vi.fn();
    s.subscribe(callback);

    action(() => {
      s.set('안녕하세요');
    });

    action(() => {
      s.set('hi');
    });

    action(() => {
      s.set('hello');
    });

    expect(callback).toHaveBeenCalledTimes(3);
  });

  it('등록된 콜백 함수가 2개 이상인 경우, 각 콜백 함수를 마지막 한 번만 호출한다.', () => {
    const s = sangtae('안녕');
    const callbacks = [vi.fn(), vi.fn(), vi.fn(), vi.fn()];
    callbacks.forEach((callback) => s.subscribe(callback));

    action(() => {
      s.set('안녕하세요');
      s.set('hi');
      s.set('hello');
    });

    callbacks.forEach((callback) => {
      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith('hello');
    });
  });

  it('computed로 파생한 상태의 콜백 함수도 마지막 한 번만 호출한다.', () => {
    const s = sangtae('안녕');
    const sCallback = vi.fn();
    s.subscribe(sCallback);

    const c = computed(s, (v) => `인사말: ${v}`);
    const cCallback = vi.fn();
    c.subscribe(cCallback);

    action(() => {
      s.set('안녕하세요');
      s.set('hi');
      s.set('hello');
    });

    expect(sCallback).toHaveBeenCalledOnce();
    expect(sCallback).toHaveBeenCalledWith('hello');

    expect(cCallback).toHaveBeenCalledOnce();
    expect(cCallback).toHaveBeenCalledWith('인사말: hello');
  });

  it('action이 중첩된 경우, action 수만큼 콜백 함수를 호출한다.', () => {
    const s = sangtae('안녕');
    const callback = vi.fn();
    s.subscribe(callback);

    action(() => {
      s.set('안녕하세요');

      action(() => {
        s.set('hi');
      });

      s.set('hello');
    });

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenNthCalledWith(1, 'hi');
    expect(callback).toHaveBeenNthCalledWith(2, 'hello');
  });
});
