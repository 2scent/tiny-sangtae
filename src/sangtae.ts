import { registerCallback, isActionRunning } from './action.ts';
import type { SubscribeCallback } from './type.ts';

/**
 * Represents a function that computes the next state based on the previous state.
 * @param prev - The previous state.
 * @returns The next state.
 */
type NextFunction<T> = (prev: T) => T;

/**
 * Represents either a new state value or a function to compute the next state.
 */
type Next<T> = T | NextFunction<T>;

/**
 * Represents a state management object.
 */
export interface Sangtae<State> {
  /**
   * Gets the current state.
   * @returns The current state.
   */
  get: () => State;

  /**
   * Sets a new state or updates the current state using a function.
   * @param next The new state or a function to update the current state.
   */
  set: (next: Next<State>) => void;

  /**
   * Subscribes to state changes.
   * @param callback The function to be called when the state changes.
   * @param [key] - An optional key to identify the subscription.
   * @returns A function to unsubscribe from state changes.
   */
  subscribe: (callback: SubscribeCallback<State>, key?: unknown) => () => void;
}

/**
 * Creates a state management object.
 * @param initialState - The initial state.
 * @returns A Sangtae object for managing the state.
 */
export function sangtae<State>(initialState: State): Sangtae<State> {
  let state = initialState;

  const callbackMap = new Map<unknown, SubscribeCallback<State>>();

  const get = () => state;

  const registerCallbacks = () => {
    for (const [key, callback] of callbackMap) {
      registerCallback(key, () => callback(state));
    }
  };

  const runCallbacks = () => {
    for (const [, callback] of callbackMap) {
      callback(state);
    }
  };

  const set = (next: Next<State>) => {
    const prev = state;

    if (typeof next === 'function') {
      state = (next as NextFunction<State>)(state);
    } else {
      state = next;
    }

    if (prev !== state) {
      if (isActionRunning()) {
        registerCallbacks();
      } else {
        runCallbacks();
      }
    }
  };

  const subscribe = (callback: SubscribeCallback<State>, key: unknown = Symbol(callback.name)) => {
    callbackMap.set(key, callback);
    return () => {
      callbackMap.delete(key);
    };
  };

  return {
    get,
    set,
    subscribe,
  };
}
