import { registerCallback, isActionRunning } from './action.ts';
import type { Callback } from './type.ts';

/**
 * A function type that takes the previous state and returns a new state
 * @template T The type of the state
 */
type NextFunction<T> = (prev: T) => T;

/**
 * Represents either a new state value or a function to update the state
 * @template T The type of the state
 */
type Next<T> = T | NextFunction<T>;

/**
 * Interface for state management
 * @template State The type of the state
 */
export interface Sangtae<State> {
  /**
   * Returns the current state
   * @returns {State} The current state
   */
  get: () => State;

  /**
   * Updates the state
   * @param {Next<State>} next The new state value or a function to update the state
   */
  set: (next: Next<State>) => void;

  /**
   * Subscribes to state changes
   * @param {Callback} callback The function to be called when the state changes
   * @returns {() => void} A function to unsubscribe
   */
  subscribe: (callback: Callback) => () => void;
}

export function sangtae<State>(initialState: State): Sangtae<State> {
  let state = initialState;

  const callbacks = new Set<Callback>();

  const get = () => state;

  const callbackKey = Symbol('sangtae');

  const runCallbacks = () => {
    for (const callback of callbacks) {
      callback();
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
        registerCallback(callbackKey, runCallbacks);
      } else {
        runCallbacks();
      }
    }
  };

  const subscribe = (callback: Callback) => {
    callbacks.add(callback);
    return () => {
      callbacks.delete(callback);
    };
  };

  return {
    get,
    set,
    subscribe,
  };
}
