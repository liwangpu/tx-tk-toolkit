import { BrowserWindow } from 'electron';

const winds = new Map<string, BrowserWindow>();

export function setWindow(key: string, win: BrowserWindow): void {
  winds.set(key, win);
}

export function getWindow(key: string): BrowserWindow | undefined {
  return winds.get(key);
}

export function removeWindow(key: string): void {
  winds.delete(key);
}
