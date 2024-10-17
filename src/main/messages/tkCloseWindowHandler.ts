import { getTKPartitionKey, IMessageHandler, IMessageParam } from './index';
import { windowManager } from '../commons';
import { ITKAccount } from '../../interfaces';

export class TkCloseWindowHandler implements IMessageHandler {

  handle({ data }: IMessageParam & { data: { account: ITKAccount } }): any {
    const windowKey = getTKPartitionKey(data.account);
    const win = windowManager.getWindow(windowKey);
    if (!win) return;
    win.close();
  }

}
