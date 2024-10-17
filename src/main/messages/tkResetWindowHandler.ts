import { getTKPartitionKey, IMessageHandler, IMessageHandlerContext, IMessageParam } from './index';
import { windowManager } from '../commons';
import { ITKAccount } from '../../interfaces';
import {
  BrowserWindow,
  Menu,
  MenuItemConstructorOptions,
  session,
} from 'electron';
import { MessageTopic } from '../../enums';

export class TKResetWindowHandler implements IMessageHandler {

  // eslint-disable-next-line no-empty-function
  constructor(protected context: IMessageHandlerContext) {
  }

  handle({ event, data }: IMessageParam<{ account: ITKAccount }>): any {
    const windowKey = getTKPartitionKey(data.account);
    const win = windowManager.getWindow(windowKey);
    const currentSession = session.fromPartition(windowKey);
    if (currentSession) {
      currentSession.clearCache();
      currentSession.clearStorageData();
    }

    if (win) {
      win.close();
      // return this.context.handler({ event, topic: MessageTopic.tkOpenWindow, data });
    }
  }

}
