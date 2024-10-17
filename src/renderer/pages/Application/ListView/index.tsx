import { observer } from 'mobx-react-lite';
import styles from './index.module.less';
import { Outlet } from 'react-router-dom';

const ListView: React.FC = observer(() => {


  return (
    <div className={styles['list-page']}>
      <Outlet />
    </div>
  );
});

ListView.displayName = 'ListView';

export default ListView;