import type { Callback } from './type.ts';

/**
 * Represents a pair of a symbol and a callback function.
 */
type CallbackPair = [symbol, Callback];

let callbackPairs: CallbackPair[] = [];

/**
 * Registers a new callback function associated with the given key.
 * @param {symbol} key - The key to associate the callback with.
 * @param {Callback} callback - The callback function to be registered.
 * @returns {void}
 */
export function registerCallback(key: symbol, callback: Callback): void {
  callbackPairs.push([key, callback]);
}

let actionCount = 0;

/**
 * Checks if an action is currently running.
 * @returns {boolean} - `true` if an action is currently running, `false` otherwise.
 */
export function isActionRunning(): boolean {
  return actionCount > 0;
}

/**
 * Executes the provided action callback and then calls all registered callbacks.
 * @param {Callback} act - The action callback to be executed.
 * @returns {void}
 */
export function action(act: Callback): void {
  actionCount++;

  act();

  const callbackMap = new Map<symbol, Callback>();

  for (const [key, callback] of callbackPairs) {
    callbackMap.set(key, callback);
  }
  callbackPairs = [];

  for (const [, callback] of callbackMap) {
    callback();
  }

  actionCount--;
}
