import { Sangtae } from './sangtae.ts';
import { SubscribeCallback } from './type.ts';

export type Computed<Select> = Omit<Sangtae<Select>, 'set'>;

type ComputedList<States extends Array<unknown>> = {
  [K in keyof States]: Computed<States[K]>;
};

type Selector<State, Select> = (state: State) => Select;

type ListSelector<States extends Array<unknown>, Select> = (...states: States) => Select;

export function computed<State, Select>(
  sangtae: Computed<State>,
  selector: Selector<State, Select>,
): Computed<Select>;

export function computed<States extends Array<unknown>, Select>(
  sangtaes: ComputedList<States>,
  selector: ListSelector<States, Select>,
): Computed<Select>;

export function computed<State, States extends Array<unknown>, Select>(
  sangtae: Computed<State> | ComputedList<States>,
  selector: Selector<State, Select> | ListSelector<States, Select>,
): Computed<Select> {
  if (Array.isArray(sangtae)) {
    const states = sangtae as ComputedList<States>;
    const select = selector as ListSelector<States, Select>;

    const get = () => select(...(states.map((s) => s.get()) as States));

    const subscribe = (
      callback: SubscribeCallback<Select>,
      key: unknown = Symbol(callback.name),
    ) => {
      const unsubscribes = states.map((s) => s.subscribe(() => callback(get()), key));
      return () => {
        for (const unsubscribe of unsubscribes) {
          unsubscribe();
        }
      };
    };

    return { get, subscribe };
  }

  const state = sangtae as Computed<State>;
  const select = selector as Selector<State, Select>;

  const get = () => select(state.get());

  const subscribe = (callback: SubscribeCallback<Select>, key?: unknown) => {
    return state.subscribe(() => callback(get()), key);
  };

  return { get, subscribe };
}
