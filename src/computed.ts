import { Sangtae } from './sangtae.ts';
import { SubscribeCallback } from './type.ts';

/**
 * Represents a computed state derived from another state.
 */
export type Computed<Select> = Omit<Sangtae<Select>, 'set'>;

/**
 * Represents a list of computed states.
 */
type ComputedList<States extends Array<unknown>> = {
  [K in keyof States]: Computed<States[K]>;
};

/**
 * A function that selects a part of the state.
 */
type Selector<State, Select> = (state: State) => Select;

/**
 * A function that selects a part of multiple states.
 */
type ListSelector<States extends Array<unknown>, Select> = (...states: States) => Select;

/**
 * Creates a computed state from a single state.
 * @param sangtae - The original state.
 * @param selector - A function to compute the new state.
 * @returns A computed state.
 */
export function computed<State, Select>(
  sangtae: Computed<State>,
  selector: Selector<State, Select>,
): Computed<Select>;

/**
 * Creates a computed state from multiple states.
 * @param sangtaes - An array of original states.
 * @param selector - A function to compute the new state from multiple states.
 * @returns A computed state.
 */
export function computed<States extends Array<unknown>, Select>(
  sangtaes: ComputedList<States>,
  selector: ListSelector<States, Select>,
): Computed<Select>;

/**
 * Implementation of the computed function.
 * This function can create a computed state from either a single state or multiple states.
 * @param sangtae - The original state(s).
 * @param selector - A function to compute the new state.
 * @returns A computed state.
 */
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
