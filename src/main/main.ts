import path from 'path';
import { app, BrowserWindow, shell, ipcMain, MenuItemConstructorOptions, Menu, session } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { getNocoScript, getTiktokScript } from './externalScripts';
import { MessageTopic } from '../enums';
import { handleMessage } from './messages';
import { getExternalPreload } from './commons';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

// if (process.env.NODE_ENV === 'production') {
//   const sourceMapSupport = require('source-map-support');
//   sourceMapSupport.install();
// }

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const currentSession = session.fromPartition('leon-us-tk001@outlook.com');

  // currentSession.setProxy({
  //   // proxyRules: `https://xiyuecc.shop/b20b73fd-0301-4509-cab1-b41fb140ce89`,
  //   proxyRules: `http://8.217.177.177:33094`,
  // }).then(() => {
  //   mainWindow.loadURL('https://www.baidu.com/');
  // }).catch(err=>{
  //   console.log(`-----------------------------------`);
  //   console.log(`err:`,err);
  // });



  mainWindow = new BrowserWindow({
    show: false,
    width: 1400,
    height: 800,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      // session: currentSession,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      // preload: getExternalPreload('preload'),
    },
  });

  mainWindow.on('page-title-updated', e => {
    e.preventDefault();
  });

  // mainWindow.loadURL(resolveHtmlPath('index.html'));
  // mainWindow.loadURL('http://127.0.0.1:9200');
  mainWindow.loadURL('http://106.55.173.188:9200');
  // mainWindow.loadURL('https://www.tiktok.com/');
  // mainWindow.loadURL('https://www.baidu.com/');

  const agent = {
    // userAgent: "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    acceptLanguages: 'en-US',
  };

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  // Once dom-ready
  mainWindow.webContents.on('dom-ready', () => {
    const script = getNocoScript();
    mainWindow.webContents.executeJavaScript(script);
    // log.info(script);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  const { webContents } = mainWindow;
  webContents.debugger.attach(); // You only need to call this once

  webContents.debugger.sendCommand('Emulation.setUserAgentOverride', {
    userAgent: agent.userAgent, // You could pass it to the main process from the renderer, or use your own
    acceptLanguage: 'en-US',
  });

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const listenMessage = () => {
  const topics = Object.keys(MessageTopic);
  for (const topic of topics) {
    // eslint-disable-next-line no-loop-func
    ipcMain.on(topic, async (event, arg) => {
      // console.log(`++++++++++++++++++++++++++++++++++++++++`);
      // console.log(`event:`,event);
      // console.log(`arg:`,arg);
      handleMessage({ mainWindow: mainWindow!, event, topic, data: arg } as any);
    });
  }
};

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
    listenMessage();
  })
  .catch(console.log);
