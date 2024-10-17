import {
  BrowserWindow,
  Menu,
  MenuItemConstructorOptions,
  session,
} from 'electron';
// import log from 'electron-log';
import {
  getTKPartitionKey,
  IMessageHandler,
  IMessageHandlerContext,
  IMessageParam,
} from './index';
import { getExternalPreload, windowManager } from '../commons';
import { getTiktokScript } from '../externalScripts';
import { MessageTopic } from '../../enums';
import { ITKAccount } from '../../interfaces';

const HOME_URL = `https://www.tiktok.com/`;

// const HOME_URL = `http://127.0.0.1:5500/`;
// const HOME_URL = `http://localhost:8901/app/renderer-test`;

export class TkOpenWindowHandler implements IMessageHandler {

  // eslint-disable-next-line no-empty-function
  constructor(protected context: IMessageHandlerContext) {
  }

  handle({ data }: { data?: { account: ITKAccount } }): any {
    const { account } = data;
    const windowKey = getTKPartitionKey(account);
    // console.log(`-------------------------------------------`);
    // console.log(`-------------------------------------------`);
    // console.log(`-------------------------------------------`);
    // console.log(`-------------------------------------------`);
    // console.log(`-------------------------------------------`);
    // console.log(`TkOpenWindowHandler:`, data);
    // return;

    if (windowManager.getWindow(windowKey)) {
      return;
    }

    const currentSession = session.fromPartition(windowKey);
    // currentSession.setProxy({
    //   proxyRules: `xiyuecc.shop/b20b73fd-0301-4509-cab1-b41fb140ce89`
    // });

    const agent = {
      // userAgent: "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      acceptLanguages: 'th-TH',
    };

    // log.info('user agent',currentSession.getUserAgent());

    if (process.env.NODE_ENV === 'production') {
      // const sourceMapSupport = require('source-map-support');
      // sourceMapSupport.install();
    }

    const winSize =
      process.env.NODE_ENV === 'production'
        ? {
          width: 1024,
          height: 780,
        }
        : {
          width: 1400,
          height: 780,
        };

    const childWin = new BrowserWindow({
      ...winSize,
      title: account.email,
      // parent: this.context.mainWindow,
      webPreferences: {
        session: currentSession,
        preload: getExternalPreload('tiktokPreload'),
        // devTools: false,
        devTools: true,
      },
    });

    const { webContents } = childWin;
    webContents.debugger.attach(); // You only need to call this once

    webContents.debugger.sendCommand('Emulation.setUserAgentOverride', {
      userAgent: agent.userAgent, // You could pass it to the main process from the renderer, or use your own
      acceptLanguage: account.language?.language,
    });

    // TkOpenWindowHandler.createMenu({ win: childWin, currentSession, data });
    // const menuBuilder = new MenuBuilder(childWin);
    // menuBuilder.buildMenu();

    windowManager.setWindow(windowKey, childWin);

    childWin.loadURL(HOME_URL);

    childWin.on('page-title-updated', e => {
      e.preventDefault();
    });

    childWin.once('ready-to-show', () => {
      childWin.show();
      webContents.setAudioMuted(true);
    });

    // Once dom-ready
    childWin.webContents.on('dom-ready', () => {
      const script = getTiktokScript(data);
      childWin.webContents.executeJavaScript(script);
      // log.info(script);
    });

    childWin.once('closed', () => {
      windowManager.removeWindow(windowKey);
      if (!this.context.mainWindow.isDestroyed()) {
        this.context.mainWindow.webContents.send(
          MessageTopic.afterTKCloseWindow,
          data,
        );
      }
    });
  }

  private static createMenu(props: {
    win: BrowserWindow;
    currentSession: Electron.Session;
    data: any;
  }) {
    const { win, currentSession, data } = props;
    const { webContents } = win;

    const template: Array<MenuItemConstructorOptions> = [
      {
        id: 'audio',
        label: '音频',
        submenu: [
          {
            id: 'audio__close',
            label: '关闭声音',
            click: () => {
              webContents.setAudioMuted(true);
            },
          },
          {
            id: 'audio__open',
            label: '开启声音',
            click: () => {
              webContents.setAudioMuted(false);
            },
          },
        ],
      },
      {
        label: '开发调试',
        submenu: [
          {
            label: '刷新',
            // accelerator: "Ctrl+W",
            click: () => {
              webContents.reload();
            },
          },
          {
            label: '打开devtools',
            // accelerator: "Ctrl+W",
            click: () => {
              // win.openDevTools()
            },
          },
          // {
          //   label: "清除缓存",
          //   click: async () => {
          //     await currentSession.clearStorageData();
          //     webContents.reload();
          //     win.webContents.executeJavaScript(getTiktokScript(data));
          //   }
          // }
        ],
      },
    ];

    const menu = Menu.buildFromTemplate(template);
    win.setMenu(menu);
  }
}
