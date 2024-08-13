import type { VoidCallback } from './type.ts';

const callbackMap = new Map<unknown, VoidCallback>();

/**
 * Registers a new callback function associated with the given key.
 * @param {symbol} key - The key to associate the callback with.
 * @param {VoidCallback} callback - The callback function to be registered.
 * @returns {void}
 */
export function registerCallback(key: unknown, callback: VoidCallback): void {
  callbackMap.set(key, callback);
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
 * @param {VoidCallback} act - The action callback to be executed.
 * @returns {void}
 */
export function action(act: VoidCallback): void {
  actionCount++;

  act();

  for (const [, callback] of callbackMap) {
    callback();
  }
  callbackMap.clear();

  actionCount--;
}
