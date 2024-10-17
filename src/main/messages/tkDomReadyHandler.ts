import { IMessageHandler, IMessageHandlerContext, IMessageParam } from "./index";
import { IEnvSetting } from "../../interfaces";
import { MessageTopic } from "../../enums";

export class TkDomReadyHandler implements IMessageHandler {

  constructor(protected context: IMessageHandlerContext) {
  }

  handle({ event, data }: { data: IEnvSetting } & IMessageParam): any {
    // return this.context.handler({ event, topic: MessageTopic.tkGotoLogin, data });
  }

}
