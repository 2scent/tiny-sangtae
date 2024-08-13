/**
 * Callback function type
 */
export type VoidCallback = () => void;

export type SubscribeCallback<State> = (state: State) => void;
