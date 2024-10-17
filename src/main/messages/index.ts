import { MessageTopic } from "../../enums";
import { OpenHtmlFileHandler } from "./openHtmlFileHandler";
import { TkOpenWindowHandler } from "./tkOpenWindowHandler";
import { BrowserWindow } from "electron";
import { TkGotoLoginHandler } from "./tkGotoLoginHandler";
import { TkCloseWindowHandler } from "./tkCloseWindowHandler";
import { TkDomReadyHandler } from "./tkDomReadyHandler";
import { TkGotoRegisterHandler } from "./tkGotoRegisterHandler";
import { DNSCheckHandler } from './DNSCheckHandler';
import { ITKAccount } from '../../interfaces';
import { TKResetWindowHandler } from './tkResetWindowHandler';
import { TkAutoWatchVideoByKeywordsHandler } from './tkAutoWatchVideoByKeywordsHandler';

export interface IMessageParam<DT = any> {
  event: any;
  topic: MessageTopic | string;
  data?: DT;
}

export interface IMessageHandlerContext {
  mainWindow: BrowserWindow;
  handler: (params: IMessageParam) => any;
}

export interface IMessageHandler {
  handle(params: IMessageParam): Promise<any> | any;
}

export interface MessageHandlerConstructor {
  new(context: IMessageHandlerContext): IMessageHandler;
}

function getActionHandler(topic: MessageTopic): MessageHandlerConstructor | null {
  switch (topic) {
    case MessageTopic.openHtmlFile:
      return OpenHtmlFileHandler;
    case MessageTopic.tkOpenWindow:
      return TkOpenWindowHandler;
    case MessageTopic.tkCloseWindow:
      return TkCloseWindowHandler;
    case MessageTopic.tkResetWindow:
      return TKResetWindowHandler;
    case MessageTopic.tkGotoLogin:
      return TkGotoLoginHandler;
    case MessageTopic.tkGotoRegister:
      return TkGotoRegisterHandler;
    case MessageTopic.tkDomReady:
      return TkDomReadyHandler;
    case MessageTopic.DNSCheck:
      return DNSCheckHandler;
    case MessageTopic.tkAutoWatchVideoByKeyword:
      return TkAutoWatchVideoByKeywordsHandler;
    default:
      return null;
  }
}

export async function handleMessage(params: IMessageParam & IMessageHandlerContext) {
  const { mainWindow, event, topic, data } = params;

  const handler = (props: IMessageParam) => {
    const Handler = getActionHandler(props.topic as any);
    // console.log(`------------------------------`);
    // console.log(`Handler:`,Handler);
    if (Handler) {
      const h = new Handler({ mainWindow, handler });
      return h.handle(props);
    }
  };

  return handler({ event, topic, data });
}

export function getTKPartitionKey(account: ITKAccount) {
  return `persist:tiktok@${account.email}`;
}
