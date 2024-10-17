import { createBrowserRouter, redirect, RouteObject, LoaderFunction, LoaderFunctionArgs } from 'react-router-dom';
import { UserRepository } from '../repositories';
import { appStore } from '../stores';

export type IAppRouteObject = RouteObject & { auth?: boolean };

export const createAppRouter = (routes: Array<IAppRouteObject>) => {

  const loop = (rs: Array<IAppRouteObject>) => {
    for (let i = 0; i < rs.length; i++) {
      const current = rs[i];
      if (current.auth) {
        rs[i] = { ...current, loader: authLoader(current.loader as any) };
      }

      if (current.children?.length) {
        loop(current.children);
      }
    }
  };

  loop(routes);
  return createBrowserRouter(routes);
}

function authLoader(originLoader?: LoaderFunction): LoaderFunction {

  return async (args: LoaderFunctionArgs) => {
    const { userStore } = appStore;
    const token = UserRepository.getToken();

    if (!token) {
      const redirectUrl = `${window.location.pathname}${window.location.search}`;
      return redirect(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
    } else {
      if (!userStore.currentUser) {
        await userStore.refreshProfile();
      }
    }

    if (originLoader) {
      return originLoader(args);
    }

    return {};
  };
}