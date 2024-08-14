import { sangtae, computed } from 'tiny-sangtae';

export const $counter = sangtae(0);

export const $counterAdded10 = computed($counter, (v) => v + 10);
export const $counterAdded100 = computed($counter, (v) => v + 100);

export const increase = () => $counter.set((v) => v + 1);
export const decrease = () => $counter.set((v) => v - 1);
