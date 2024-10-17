import { getTKPartitionKey, IMessageHandler, IMessageHandlerContext, IMessageParam } from './index';
import { windowManager } from '../commons';
import { MessageTopic } from '../../enums';
import { ITKAccount } from '../../interfaces';

export class TkAutoWatchVideoByKeywordsHandler implements IMessageHandler {

  constructor(protected context: IMessageHandlerContext) {
  }

  handle({ event, data }: IMessageParam & { data: { account: ITKAccount } }): any {
    const windowKey = getTKPartitionKey(data.account);
    const win = windowManager.getWindow(windowKey);
    if (!win) return;
    win.webContents.send(MessageTopic.tkAutoWatchVideoByKeyword, data);
  }

}
