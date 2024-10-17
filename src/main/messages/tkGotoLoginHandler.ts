import { getTKPartitionKey, IMessageHandler, IMessageHandlerContext, IMessageParam } from './index';
import { windowManager } from '../commons';
import { MessageTopic } from '../../enums';
import { ITKAccount } from '../../interfaces';

export class TkGotoLoginHandler implements IMessageHandler {

  constructor(protected context: IMessageHandlerContext) {
  }

  handle({ event, data }: IMessageParam & { data: { account: ITKAccount } }): any {
    const windowKey = getTKPartitionKey(data.account);
    console.log(`------------------------------------------------`);
    console.log(`windowKey:`, windowKey);
    const win = windowManager.getWindow(windowKey);
    console.log(`win:`,!!win);
    if (!win) return;
    win.webContents.send(MessageTopic.tkGotoLogin, data);
  }

}
