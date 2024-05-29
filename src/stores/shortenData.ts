import { writable } from 'svelte/store';
import type { URLData } from '../app';

export const urlData = writable({} as URLData);