type NextFunction<T> = (prev: T) => T;

type Next<T> = T | NextFunction<T>;

type Callback = () => void;

interface Sangtae<State> {
  get: () => State;
  set: (next: Next<State>) => void;
  subscribe: (callback: Callback) => () => void;
}

export function sangtae<State>(initialState: State): Sangtae<State> {
  let state = initialState;

  const callbacks = new Set<Callback>();

  const get = () => state;

  const set = (next: Next<State>) => {
    const prev = state;

    if (typeof next === 'function') {
      state = (next as NextFunction<State>)(state);
    } else {
      state = next;
    }

    if (prev !== state) {
      for (const callback of callbacks) {
        callback();
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
