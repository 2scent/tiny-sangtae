/**
 * Represents a callback function that doesn't take any arguments and doesn't return a value.
 * Typically used for side effects or actions that need to be performed without input or output.
 */
export type VoidCallback = () => void;

/**
 * Represents a callback function that is called when a state changes.
 * @param state - The current state after a change has occurred.
 */
export type SubscribeCallback<State> = (state: State) => void;
