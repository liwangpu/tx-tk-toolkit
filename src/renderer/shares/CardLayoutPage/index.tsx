import { observer } from 'mobx-react-lite';
import styles from './index.module.less';

export interface ICardLayoutPageProps {
  children?: React.ReactNode;
  buttons?: React.ReactNode;
}

export const CardList: React.FC<{ children?: React.ReactNode }> = ({ children }) => {

  return (
    <div>
      {children}
    </div>
  );
};

CardList.displayName = 'CardList';

export const Page: React.FC<ICardLayoutPageProps> = observer(props => {

  const { children, buttons } = props;

  return (
    <div className={styles['page']}>
      <div className={styles['page__content']}>
        {children}
      </div>
      {buttons && (
        <div className={styles['page__buttons']}>
          {buttons}
        </div>
      )}
    </div>
  );
});

Page.displayName = 'CardLayoutPage';
