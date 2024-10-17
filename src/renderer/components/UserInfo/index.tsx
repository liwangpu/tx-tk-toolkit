import { PoweroffOutlined, UserOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRepository } from '../../repositories';
import styles from './index.module.less';
import { appStore } from '../../stores';
import defaultUserImg from '../../images/default-user.jpg';

const INFO_STYLE = {
  backgroundImage: 'url("../../images/user-popover-background.webp")',
};

const UserInfo: React.FC = observer(props => {

  const navigate = useNavigate();
  const { userStore } = appStore;


  const handleLogout = () => {
    UserRepository.logout();
    navigate(`/login`);
  };

  return (
    <div className={styles['card']} style={INFO_STYLE}>
      <div className={styles['card__header']}>
        <div className={styles['user-info']}>
          <div className={styles['user-info__avatar']}>
            <UserAvator size='56px' />
          </div>
          <div className={styles['user-info__name']}>
            {userStore.currentUser && userStore.currentUser.name}
          </div>
        </div>
      </div>
      <div className={styles['card__content']}>
        {userStore.currentUser && (
          <table className={styles['info']}>
            <tbody>
              <tr className={styles['info__item']}>
                <td className={styles['info__title']}>工作区</td>
                <td className={styles['info__value']}>
                  {userStore.currentUser.tenantName}
                </td>
              </tr>
              <tr className={styles['info__item']}>
                <td className={styles['info__title']}>手机</td>
                <td className={styles['info__value']}>
                  {userStore.currentUser.phone}
                </td>
              </tr>
              <tr className={styles['info__item']}>
                <td className={styles['info__title']}>邮箱</td>
                <td className={styles['info__value']}>
                  {userStore.currentUser.email}
                </td>
              </tr>
            </tbody>
          </table>
        )}

      </div>
      <div className={styles['card__footer']}>
        <Button type="text" icon={<UserOutlined />} >个人中心</Button>
        <Button type="text" icon={<PoweroffOutlined />} onClick={handleLogout}>退出登录</Button>
      </div>
    </div>
  );
});

UserInfo.displayName = 'UserInfo';

export default UserInfo;

export const UserAvator: React.FC<{ size?: string }> = observer(({ size = '24px' }) => {

  return (
    <div className={styles['avator']} style={{ width: size, height: size, }}>
      <img src={defaultUserImg} />
    </div>
  );
});

UserAvator.displayName = 'UserAvator';

