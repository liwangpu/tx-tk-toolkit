import { app } from 'electron';
import path from 'path';

const PRELOAD_DIR = path.join(__dirname, '../', 'messages');

export function getExternalPreload(fileName: string) {

  return app.isPackaged
    ? path.join(__dirname, `${fileName}.js`)
    : path.join(PRELOAD_DIR, '../dll', `${fileName}.js`);
}
