import * as ReactDOM from 'react-dom/client';
import { Navigate, RouterProvider } from 'react-router-dom';
import App from './App';
import { appStore } from './stores';
import { axiosGlobalSetup, createAppRouter } from './utils';

axiosGlobalSetup();

const Login = () => import('./pages/Login');
const Home = () => import('./pages/Home');
const Message = () => import('./pages/Message');
const Setting = () => import('./pages/Setting');
const Adding = () => import('./pages/Adding');
const NotFound = () => import('./pages/NotFound');
const Application = () => import('./pages/Application');
const Whoer = () => import('./pages/Whoer');



const router = createAppRouter([
  {
    path: 'login',
    lazy: Login,
  },
  {
    path: 'not-found',
    lazy: NotFound,
  },
  {
    path: "app",
    element: <App />,
    children: [
      {
        path: 'home',
        lazy: Home,
      },
      {
        path: 'application',
        lazy: Application,
        children: [

        ]
      },
      {
        path: 'whoer',
        lazy: Whoer,
      },
      {
        path: 'message',
        lazy: Message,
      },
      {
        path: 'setting',
        lazy: Setting,
      },
      {
        index: true,
        element: <Navigate to="home" replace={true} />,
      }
    ],
    loader: () => {
      appStore.preferenceStore.initialize();
      return true;
    },
    auth: true,
  },
  {
    index: true,
    element: <Navigate to="/app" replace={true} />,
  },
  {
    path: '*',
    element: <Navigate to="/app" replace={true} />,
  },
  // {
  //   path: '*',
  //   element: <Navigate to="/not-found" replace={true} />,
  // },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <RouterProvider router={router} />
);
