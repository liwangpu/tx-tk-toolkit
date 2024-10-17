import {BrowserWindow} from 'electron';
import {IMessageHandler, IMessageHandlerContext, IMessageParam} from './index';

const HOME_URL = `https://whoer.net/zh`;

export class DNSCheckHandler implements IMessageHandler {

  constructor(protected context: IMessageHandlerContext) {
  }

  handle({event, data}: IMessageParam & { data: { account: string } }): any {

    const agent = {
      // userAgent: "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      acceptLanguages: 'th-TH',
    };

    const childWin = new BrowserWindow({
      width: 1024,
      height: 780,
      autoHideMenuBar: true,
      webPreferences: {
        devTools: false,
      },
    });

    const {webContents} = childWin;
    webContents.debugger.attach(); // You only need to call this once

    webContents.debugger.sendCommand('Emulation.setUserAgentOverride', {
      userAgent: agent.userAgent, // You could pass it to the main process from the renderer, or use your own
      acceptLanguage: agent.acceptLanguages,
    });

    childWin.loadURL(HOME_URL);

  }

}
