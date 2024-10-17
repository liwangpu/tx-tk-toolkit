import { MessageTopic } from '../../enums';
import { Button, notification } from 'antd';

export function useMessageCenter() {

  const sendMessage = (params: { topic: MessageTopic, data?: any }) => {
    if (!window.electron) {
      console.log(`当前不在Electron App中,故该消息将不会发送:`, params);
      const description = `当前不在Electron App中,故该消息将不会发送`;
      notification.open({
        message: '温馨提示',
        description,
      });
      return;
    }
    window.electron.ipcRenderer.sendMessage(params.topic as any, params.data);
  };

  return {
    // settingTiktokEnv(env: IEnvSetting) {
    //   sendMessage({ topic: MessageTopic.settingEnv, data: env });
    // },
    startupTiktokWindow(params: { account: string }) {
      sendMessage({ topic: MessageTopic.tkOpenWindow, data: params });
    },
    shutDownTiktokWindow(params: { account: string }) {
      sendMessage({ topic: MessageTopic.tkCloseWindow, data: params });
    },
    gotoLogin(params: { account: string, password: string }) {
      sendMessage({ topic: MessageTopic.tkGotoLogin, data: params });
    },
    gotoRegister(params: { account: string, password: string }) {
      sendMessage({ topic: MessageTopic.tkGotoRegister, data: params });
    }
  };
}
