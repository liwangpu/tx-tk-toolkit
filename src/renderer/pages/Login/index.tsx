import { LockOutlined, RightOutlined, UserOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import classnames from 'classnames';
import { isFunction } from 'lodash';
import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserRepository } from '../../repositories';
import styles from './index.module.less';

const DEFAULT_USER = { username: 'leon', password: 'Leon.pu199139!' };

export const Component: React.FC = observer(() => {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();

  const handleLogin = async () => {
    try {
      const { username, password } = await form.validateFields();

      await UserRepository.login(username, password);
      const redirect = '/';
      // const redirect = searchParams.get('redirect') || '/';
      console.log(`redirect:`, redirect);
      navigate(redirect);
    } catch (error) {
      console.log(`error:`, error);
    }
  };

  return (
    <div className={styles['page']}>
      <div className={styles["screen"]}>
        <div className={styles["screen__content"]}>
          <Form
            form={form}
            name="basic"
            className={styles["login"]}
            autoComplete="off"
            initialValues={DEFAULT_USER}
          >

            <div className={styles["login__field"]}>
              <UserOutlined className={styles['login__icon']} />
              <Form.Item
                name="username"
                noStyle={true}
                rules={[{ required: true, message: '用户名为必填信息!' }]}
              >
                <UsernameInput />
              </Form.Item>
            </div>

            <div className={styles["login__field"]}>
              <LockOutlined className={styles['login__icon']} />
              <Form.Item
                name="password"
                noStyle={true}
                rules={[{ required: true, message: '密码为必填信息!' }]}
              >
                <PasswordInput />
              </Form.Item>
            </div>

            <button className={classnames(
              styles['button'],
              styles['login__submit'],
            )}
              onClick={handleLogin}
            >
              <span className={styles["button__text"]}>登  录</span>
              <RightOutlined className={styles["button__icon"]} />
            </button>

          </Form>
          <div className={styles["social-login"]}>
            {/* <h3>log in via</h3> */}
            <div className={styles["social-icons"]}>
              <a href="#" className="social-login__icon fab fa-instagram"></a>
              <a href="#" className="social-login__icon fab fa-facebook"></a>
              <a href="#" className="social-login__icon fab fa-twitter"></a>
            </div>
          </div>
        </div>
        <div className={styles["screen__background"]}>
          <span className={classnames(
            styles['screen__background__shape'],
            styles['screen__background__shape3'],
          )}></span>
          <span className={classnames(
            styles['screen__background__shape'],
            styles['screen__background__shape2'],
          )}></span>
          <span className={classnames(
            styles['screen__background__shape'],
            styles['screen__background__shape1'],
          )}></span>
        </div>
      </div>
    </div >
  );
});

Component.displayName = "Login";


interface IInput {
  value?: any;
  onChange?: (val: any) => void;
}

const UsernameInput: React.FC<IInput> = props => {
  const { value, onChange } = props;

  const handleOnChange = useCallback((e: any) => {
    const v = e.target.value;
    if (isFunction(onChange)) {
      onChange(v);
    }
  }, []);

  return (
    <input type="text" value={value || ''} onChange={handleOnChange} className={styles["login__input"]} placeholder='用户名' />
  );
}

UsernameInput.displayName = 'UsernameInput';

const PasswordInput: React.FC<IInput> = props => {
  const { value, onChange } = props;

  const handleOnChange = useCallback((e: any) => {
    const v = e.target.value;
    if (isFunction(onChange)) {
      onChange(v);
    }
  }, []);

  return (
    <input type="password" value={value || ''} onChange={handleOnChange} className={styles["login__input"]} placeholder='密码' />
  );
}

PasswordInput.displayName = 'PasswordInput';