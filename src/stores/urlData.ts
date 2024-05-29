import { writable } from 'svelte/store';
import type { URLData } from '../app.d';

export const urlData = writable({} as URLData);