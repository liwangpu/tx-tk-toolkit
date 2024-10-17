import { observer } from 'mobx-react-lite';
import { connectReduxDevtools } from 'mst-middlewares';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from './components/AppSidebar';
import styles from './app.module.less';
import { appStore } from './stores';
import { ConfigProvider, theme } from 'antd';

const handleDetectStore = () => {
  connectReduxDevtools(require("remotedev"), appStore);
};

const themeConfig = {
  token: {
    // colorPrimary: 'red',
    borderRadius: 4,
  },
  // algorithm: [theme.compactAlgorithm],
};

const App = observer(() => {

  // const { TKAccountStore, platformStore, supplierStore, warehouseStore, stationStore } = appStore;


  useEffect(() => {
    // TKAccountStore.getAllShopOptions();
    // supplierStore.getAllSupplierOptions();
    // warehouseStore.getAllWarehouseOptions();
    // platformStore.getAllOptions();
    // stationStore.getAllOptions();
    // handleDetectStore();
  }, []);

  return (
    <ConfigProvider theme={themeConfig}>
      <div className={styles['app']}>
        <div className={styles['app__navigation']}>
          <AppSidebar />
        </div>
        <div className={styles['app__page']}>
          <Outlet />
        </div>
      </div>
    </ConfigProvider>
  );
});

App.displayName = 'App';

export default App;
