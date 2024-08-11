/**
 * Callback function type
 */
export type Callback = () => void;

export type SubscribeCallback<State> = (state: State) => void;
