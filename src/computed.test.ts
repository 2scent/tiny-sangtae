import { describe, expect, it, vi } from 'vitest';
import { sangtae } from './sangtae.ts';
import { computed } from './computed.ts';

describe('computed', () => {
  describe('single', () => {
    it('sangtae 또는 computed를 기반으로 파생 상태를 만든다.', () => {
      const s = sangtae('Lee');
      const c1 = computed(s, (v) => ({ lastName: v }));
      const c2 = computed(c1, (v) => ({ ...v, firstName: 'Hyanggi' }));

      expect(c1.get()).toEqual({ lastName: 'Lee' });
      expect(c2.get()).toEqual({ lastName: 'Lee', firstName: 'Hyanggi' });
    });

    describe('get', () => {
      it('상태가 "Lee"일 때, selector가 v => v + " Hyanggi"이면, "Lee Hyanggi"를 리턴한다.', () => {
        const s = sangtae('Lee');
        const c = computed(s, (v) => v + ' Hyanggi');

        expect(c.get()).toEqual('Lee Hyanggi');
      });

      it('selector가 () => "Hyanggi"이면, 상태에 상관 없이 "Hyanggi"를 리턴한다.', () => {
        const s = sangtae('Lee');
        const c = computed(s, () => 'Hyanggi');

        s.set('Kim');

        expect(c.get()).toEqual('Hyanggi');
      });

      it('상태가 변경되면, 변경된 상태에 selector를 적용한 값을 리턴한다.', () => {
        const s = sangtae('Lee');
        const c = computed(s, (v) => v + ' Hyanggi');

        s.set('Kim');

        expect(c.get()).toEqual('Kim Hyanggi');
      });
    });

    describe('subscribe', () => {
      it('상태가 변경되면, 등록한 콜백 함수를 파생된 상태와 함께 호출한다.', () => {
        const s = sangtae('Lee');
        const c = computed(s, (v) => v + ' Hyanggi');
        const callback = vi.fn();

        c.subscribe(callback);
        s.set('Kim');

        expect(callback).toHaveBeenCalledWith('Kim Hyanggi');
      });

      it('set을 호출한 만큼 등록한 콜백 함수를 호출한다.', () => {
        const s = sangtae('Lee');
        const c = computed(s, (v) => v + ' Hyanggi');
        const callback = vi.fn();

        c.subscribe(callback);
        s.set('Kim');
        s.set('Park');
        s.set('Jung');
        s.set('Choi');
        s.set('Kang');

        expect(callback).toBeCalledTimes(5);
      });

      it('리턴한 함수 "unsubscribe"를 호출하면 더 이상 콜백을 호출하지 않는다.', () => {
        const s = sangtae('Lee');
        const c = computed(s, (v) => v + ' Hyanggi');
        const callback = vi.fn();

        const unsubscribe = c.subscribe(callback);
        s.set('Kim');
        s.set('Park');
        s.set('Jung');

        unsubscribe();
        s.set('Choi');
        s.set('Kang');

        expect(callback).toBeCalledTimes(3);
      });
    });
  });

  describe('multi', () => {
    it('여러 상태를 기반으로 파생 상태를 만든다.', () => {
      const s1 = sangtae('Lee');
      const s2 = sangtae(123);
      const s3 = sangtae(true);
      const c = computed([s1, s2, s3], (v1, v2, v3) => `${v1} ${v2} ${v3}`);

      expect(c.get()).toEqual('Lee 123 true');
    });

    describe('get', () => {
      it('상태가 변경되면, 변경된 상태에 selector를 적용한 값을 리턴한다.', () => {
        const s1 = sangtae('Lee');
        const s2 = sangtae(123);
        const s3 = sangtae(true);
        const c = computed([s1, s2, s3], (v1, v2, v3) => `${v1} ${v2} ${v3}`);

        s1.set('Kim');
        s2.set(456);
        s3.set(false);

        expect(c.get()).toEqual('Kim 456 false');
      });
    });

    describe('subscribe', () => {
      it('상태가 변경되면, 등록한 콜백 함수를 파생된 상태와 함께 호출한다.', () => {
        const s1 = sangtae('Lee');
        const s2 = sangtae(123);
        const s3 = sangtae(true);
        const c = computed([s1, s2, s3], (v1, v2, v3) => `${v1} ${v2} ${v3}`);
        const callback = vi.fn();

        c.subscribe(callback);
        s1.set('Kim');
        s2.set(456);
        s3.set(false);

        expect(callback).toHaveBeenNthCalledWith(1, 'Kim 123 true');
        expect(callback).toHaveBeenNthCalledWith(2, 'Kim 456 true');
        expect(callback).toHaveBeenNthCalledWith(3, 'Kim 456 false');
      });

      it('리턴한 함수 "unsubscribe"를 호출하면 더 이상 콜백을 호출하지 않는다.', () => {
        const s1 = sangtae('Lee');
        const s2 = sangtae(123);
        const s3 = sangtae(true);
        const c = computed([s1, s2, s3], (v1, v2, v3) => `${v1} ${v2} ${v3}`);
        const callback = vi.fn();

        const unsubscribe = c.subscribe(callback);
        s1.set('Kim');
        s2.set(456);

        unsubscribe();
        s3.set(false);

        expect(callback).toBeCalledTimes(2);
      });
    });
  });
});
