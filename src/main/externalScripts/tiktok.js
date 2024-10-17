// noinspection JSUnresolvedReference

export default function startup() {
  const env = (() => {
    const getEnv = (property) => {
      return window._$$_toolkit_env[property] || {};
    };
    return {
      account: getEnv('account'),
      username: getEnv('account').email,
      password: getEnv('account').password,
      language: getEnv('account').language?.language,
      searchTerms: getEnv('account').search_term,
    };
  })();
  console.log(`----------------------------------------------------`);
  console.log(`小工具脚本已经运行`);
  console.log(`小工具系统环境变量:`, env);
  console.log(`----------------------------------------------------`);

  //********************************** 一些常量 **********************************//
  const MESSAGE_TOPIC_GOTO_LOGIN = 'tkGotoLogin';
  const MESSAGE_TOPIC_GOTO_REGISTER = 'tkGotoRegister';
  const MESSAGE_TOPIC_DOM_READY = 'tkDomReady';
  const MESSAGE_TOPIC_AUTO_WATCH_VIDEO_BY_KEYWORD = 'tkAutoWatchVideoByKeyword';

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

  // UIDomManager里面设定所有的方法都是async的
  const UIDomManager = (() => {
    return {
      selectNode(selectFn, condition, time = 200) {
        let node;
        const doSelect = () => {
          let dom = selectFn();
          if (typeof condition === 'function') {
            const result = condition(dom);
            return result ? dom : null;
          }
          return dom;
        };
        node = doSelect();
        if (node) return node;
        return new Promise((resolve, reject) => {
          let retryTime = 0;
          const it = setInterval(() => {
            if (retryTime > 15) {
              return reject(
                '已经尝试获取超过15次,认定开发过程中有错误,将不再进行dom扫描,要查询的dom订阅为:',
                selectFn.toString(),
              );
            }
            node = doSelect();
            // console.log(`do select:`, retryTime, selectFn.toString());
            retryTime++;
            if (node) {
              clearInterval(it);
              resolve(node);
            }
          }, time);
        });
      },
      setNativeInputValue(element, value) {
        let lastValue = element.value;
        element.value = value;
        let event = new Event('input', { target: element, bubbles: true });
        // React 15
        event.simulated = true;
        // React 16
        let tracker = element._valueTracker;
        if (tracker) {
          tracker.setValue(lastValue);
        }
        element.dispatchEvent(event);
      },
    };
  })();

  const LoginModal = (() => {
    let loginContainer;
    let loginModal;
    return {
      async show() {
        const btn = await UIDomManager.selectNode(() =>
          document.getElementById('header-login-button'),
        );
        btn.click();
        loginModal = await UIDomManager.selectNode(() =>
          document.getElementById('login-modal'),
        );
        loginContainer = await UIDomManager.selectNode(() =>
          document.getElementById('loginContainer'),
        );
        return loginContainer;
      },
      async loginByEmail() {
        const loginTypeButtons = await UIDomManager.selectNode(
          () => loginContainer.querySelectorAll('div[role="link"]'),
          (nodeList) => nodeList && nodeList.length > 0,
        );
        // loginButtons
        // 0:使用二维码
        // 1:使用手机号/邮箱登录
        const emailTypeLoginBtn = loginTypeButtons[1];
        emailTypeLoginBtn.click();
        // 切换使用邮箱登录
        const toggleEmailLoginLink = await UIDomManager.selectNode(() =>
          loginContainer.querySelector('a[href="/login/phone-or-email/email"]'),
        );
        toggleEmailLoginLink.click();
        // 把账号密码填入输入框
        const inputs = await UIDomManager.selectNode(
          () => loginContainer.querySelectorAll('input[placeholder]'),
          (ipts) => ipts && ipts.length > 0,
        );
        UIDomManager.setNativeInputValue(inputs[0], env.username);
        UIDomManager.setNativeInputValue(inputs[1], env.password);
        const loginButton = await UIDomManager.selectNode(() =>
          loginContainer.querySelector('button[type="submit"]'),
        );
        loginButton.click();
      },
      async register() {
        const signupLink = await UIDomManager.selectNode(() =>
          loginModal.querySelector('a[href="/signup"]'),
        );
        signupLink.click();
        const registerTypeButtons = await UIDomManager.selectNode(
          () => loginContainer.querySelectorAll('div[role="link"]'),
          (nodeList) => nodeList && nodeList.length > 0,
        );
        const emailLoginTypeButton = registerTypeButtons[0];
        emailLoginTypeButton.click();
        const signupByEmailButton = await UIDomManager.selectNode(() =>
          loginContainer.querySelector(
            'a[href="/signup/phone-or-email/email"]',
          ),
        );
        signupByEmailButton.click();
        const combobox = await UIDomManager.selectNode(
          () => loginContainer.querySelectorAll('div[role="combobox"]'),
          (nodeList) => nodeList && nodeList.length > 0,
        );
        // 输入出生日期 月 日 年
        combobox[0].children[1].children[0].click();
        combobox[1].children[1].children[0].click();
        combobox[2].children[1].children[32].click();

        const inputs = await UIDomManager.selectNode(
          () => loginContainer.querySelectorAll('input[placeholder]'),
          (ipts) => ipts && ipts.length > 0,
        );
        // 输入账号密码
        UIDomManager.setNativeInputValue(inputs[0], env.username);
        UIDomManager.setNativeInputValue(inputs[1], env.password);
        // 发送验证码
        const sendCodeButton = await UIDomManager.selectNode(
          () => loginContainer.querySelector('button[type="button"]'),
          (btn) => btn && !btn.hasAttribute('disabled'),
        );
        sendCodeButton.click();

        // alert('已经发送验证码了,请到邮箱查收!');
        console.log(`sendCodeButton:`, sendCodeButton);
      },
    };
  })();

  const AccountManager = (() => {
    return {
      async login(account) { },
      async loginByEmail(account) {
        try {
          await LoginModal.show();
          await LoginModal.loginByEmail();
        } catch (e) {
          console.error('通过邮箱登录过程出现错误:', e);
        }
      },
      async register(account) {
        try {
          await LoginModal.show();
          await LoginModal.register();
          // LoginModal.signinByEmail();
        } catch (e) { }
      },
    };
  })();

  /**
 * 一些公共UI部件管理器
 * @type {{getAppHeader(): HTMLElement}}
 */
  const UIPartManager = (() => {
    let appHeader;
    return {
      /**
       * 应用头部header
       * @returns {HTMLElement}
       */
      async getAppHeader() {
        if (!appHeader) {
          appHeader = await UIDomManager.selectNode(() =>
            document.getElementById('app-header'),
          );
        }
        return appHeader;
      },
      async getSearchInput() {
        const appHeader = await this.getAppHeader();
        const searchForm = await UIDomManager.selectNode(() =>
          appHeader.querySelector('form[action="/search"]'),
        );
        const input = await UIDomManager.selectNode(() =>
          searchForm.querySelector('input'),
        );
        const searchButton = await UIDomManager.selectNode(() =>
          searchForm.querySelector('button'),
        );
        return {
          input,
          doSearch(keyword) {
            UIDomManager.setNativeInputValue(input, keyword);
            searchButton.click();
          },
        };
      },
      /**
       * 根据关键词搜索后的视频展示列表
       */
      async getSearchItemList() {
        const generalSearchContainer = await UIDomManager.selectNode(() =>
          document.getElementById('main-content-general_search'),
        );
        return UIDomManager.selectNode(() =>
          generalSearchContainer.querySelector('div[mode="search-video-list"]'),
        );
      },
      async getVideoPlayDialog() {
        const generalSearchContainer = await UIDomManager.selectNode(() =>
          document.getElementById('main-content-general_search'),
        );
        // videoDialogContainer children有两个,第一个是视频,第二个是视频相关评论
        const videoDialogContainer = await UIDomManager.selectNode(() =>
          generalSearchContainer.querySelector(
            'div[data-focus-lock-disabled="disabled"]>div[role="dialog"]',
          ),
        );
        // 视频容器wrapper
        const videoWrapperContainer = videoDialogContainer.children[0];
        // 视频评论相关容器wrapper
        //const videoRelationWrapperContainer = videoDialogContainer.children[1];
        const gotoNextVideoButton = await UIDomManager.selectNode(() =>
          videoWrapperContainer.querySelector('button[data-e2e="arrow-right"]'),
        );
        // 视频容器下有两个核心相关的div,一个是视频(children下标0),另一个是视频进度条(children下标1)
        const videoContainer = videoWrapperContainer.children[2];
        const videoTag = await UIDomManager.selectNode(() =>
          videoContainer.querySelector('video'),
        );
        return {
          autoWatch() {
            try {
              let lastVideoDuration = 0;
              let sameTimeDurationCheckTime = 0;
              const toNext = () => {
                // const duration = isNaN(videoTag.duration) ? 0 : Math.floor(videoTag.duration);
                // if (isNaN(duration)) {
                //   console.log(`当前获取不到视频时间`);
                //   setTimeout(() => {
                //     toNext();
                //   }, 1000);
                //   return;
                // }
                // let videoTime = duration * 1000;
                // if (
                //   duration === lastVideoDuration &&
                //   sameTimeDurationCheckTime < 3
                // ) {
                //   console.log(`这视频长度和上一个貌似一样,再进入试试`);
                //   sameTimeDurationCheckTime++;
                //   setTimeout(() => {
                //     toNext();
                //   }, 1200);
                //   return;
                // }
                // lastVideoDuration = duration;
                // sameTimeDurationCheckTime = 0;
                // console.log(`视频时长${duration}秒,进入视频监听!`);
                // setTimeout(() => {
                //   console.log(`视频结束,进入下一个!`);
                //   gotoNextVideoButton.click();
                //   toNext();
                // }, videoTime);

                setTimeout(() => {
                  console.log(`视频结束,进入下一个!`);
                  gotoNextVideoButton.click();
                  toNext();
                }, 30000);
              };

              toNext();
            } catch (e) {

            }
          },
        };
      },
    };
  })();

  /**
   * 自动刷新视频管理器
   * @type {{searchVideo(*)}}
   */
  const VideoAutomationManager = (() => {
    return {
      async autoWatchVideoByKeyword(searchTerms) {
        const defaultKeyword = searchTerms[0].keyword;
        console.log(`searchTerms:`, searchTerms);
        const { doSearch } = await UIPartManager.getSearchInput();
        doSearch(defaultKeyword);
        const searchItemList = await UIPartManager.getSearchItemList();
        const itemContainer = searchItemList.children[0];
        const videoLink = await UIDomManager.selectNode(() =>
          itemContainer.querySelector('a[href]'),
        );
        videoLink.click();
        //const searchResultPanel = searchItemList.parentNode.parentNode;
        const { autoWatch } = await UIPartManager.getVideoPlayDialog();
        autoWatch();
      },
    };
  })();

  //********************************** 脚本加载结束后,订阅和发送一些消息 **********************************//
  // 登录
  messageCenter.subscribe(
    MESSAGE_TOPIC_GOTO_LOGIN,
    AccountManager.loginByEmail,
  );
  // 注册
  messageCenter.subscribe(MESSAGE_TOPIC_GOTO_REGISTER, AccountManager.register);

  // 根据关键词自动刷新视频
  messageCenter.subscribe(MESSAGE_TOPIC_AUTO_WATCH_VIDEO_BY_KEYWORD, (data) => {
    const { searchTerms } = env;
    VideoAutomationManager.autoWatchVideoByKeyword(searchTerms);
  });

  // messageCenter.subscribe(MESSAGE_TOPIC_GOTO_LOGIN, async (data) => {
  //   try {
  //     const inputs = await UIDomManager.selectNode(() => document.querySelectorAll("form input"), ipts => ipts && ipts.length > 0);
  //     UIDomManager.setNativeInputValue(inputs[0], env.username);
  //     UIDomManager.setNativeInputValue(inputs[1], env.password);
  //   } catch (e) {
  //     console.log("有错误:", e);
  //   }
  // });
  // 脚本加载完毕,发送消息往主程序
  messageCenter.publish(MESSAGE_TOPIC_DOM_READY, env);
}
