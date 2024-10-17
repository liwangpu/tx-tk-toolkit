import { MessageTopic } from '../enums';

export interface IMessage {
  topic: MessageTopic;
  data?: any;
}
