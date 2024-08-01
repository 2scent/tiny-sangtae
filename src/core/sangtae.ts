type Callback = () => void;

interface Sangtae<T> {
  get: () => T;
  set: (next: T | ((prev: T) => T)) => void;
  subscribe: (callback: Callback) => () => void;
}

export function sangtae<T>(initialState: T): Sangtae<T> {
  let state = initialState;

  const callbacks = new Set<Callback>();

  const get = () => state;

  const set = (next: T | ((prev: T) => T)) => {
    const prev = state;

    if (typeof next === 'function') {
      state = (next as (prev: T) => T)(state);
    } else {
      state = next;
    }

    if (prev !== state) {
      callbacks.forEach((callback) => callback());
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
