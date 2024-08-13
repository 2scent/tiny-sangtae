import type { VoidCallback } from './type.ts';

/**
 * A map to store callbacks associated with unique keys.
 */
const callbackMap = new Map<unknown, VoidCallback>();

/**
 * Registers a callback function with a unique key.
 * @param key - A unique identifier for the callback.
 * @param callback - The callback function to be registered.
 */
export function registerCallback(key: unknown, callback: VoidCallback): void {
  callbackMap.set(key, callback);
}

/**
 * Keeps track of the number of active actions.
 */
let actionCount = 0;

/**
 * Checks if an action is currently running.
 * @returns True if an action is running, false otherwise.
 */
export function isActionRunning(): boolean {
  return actionCount > 0;
}

/**
 * Executes a given function as an action and runs all registered callbacks.
 * This function ensures that all side effects are properly handled and callbacks are executed.
 * @param act - The function to be executed as an action.
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
