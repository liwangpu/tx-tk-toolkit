
export default function startup() {
  console.log(`----------------------------------------------------`);
  console.log(`小工具脚本已经运行!`);
  console.log(`小工具系统环境变量:`, window._$$_toolkit_env);
  console.log(`----------------------------------------------------`);

    //********************************** 一些常量 **********************************//
    const MESSAGE_TOPIC_GOTO_LOGIN = 'tkGotoLogin';
    const MESSAGE_TOPIC_GOTO_REGISTER = 'tkGotoRegister';
    const MESSAGE_TOPIC_DOM_READY = 'tkDomReady';

  //********************************** 消息中心 **********************************//
  const messageCenter = (() => {
    return {
      subscribe(topic, cb) {
        window.electron.ipcRenderer.on(topic, (data) => {
          console.log(`==> 接收到消息:`, topic, data);
          cb(data);
        });
      },
      publish(topic, data) {
        console.log(`<== 发送消息:`, topic, data);
        window.electron.ipcRenderer.sendMessage(topic, data);
      },
    };
  })();

    //********************************** 脚本加载结束后,订阅和发送一些消息 **********************************//
  // // 登录
  // messageCenter.subscribe(
  //   MESSAGE_TOPIC_GOTO_LOGIN,
  //   AccountManager.loginByEmail,
  // );

  // 注册
  // messageCenter.subscribe(MESSAGE_TOPIC_GOTO_REGISTER, AccountManager.register);


  // 脚本加载完毕,发送消息往主程序
  messageCenter.publish(MESSAGE_TOPIC_DOM_READY);
}
