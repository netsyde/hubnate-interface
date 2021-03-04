import React, { lazy } from 'react';
import { Redirect } from 'react-router-dom';
import { Main as MainLayout } from '@components/layouts';

const routes = [
  {
    route: '*',
    component: MainLayout,
    routes: [
      {
        path: '/',
        exact: true,
        component: lazy(() => import('@components/views/Main'))
      },
      {
        path: '/cabinet',
        exact: true,
        component: lazy(() => import('@components/views/Main'))
      },
      {
        path: '/404',
        exact: true,
        component: lazy(() => import('@components/views/Main'))
      },
      {
        component: () => <Redirect to="/404" />
      }
    ]
  }
];

export default routes;