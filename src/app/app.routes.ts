import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { AppSideLoginComponent } from './pages/authentication/side-login/side-login.component';

export const routes: Routes = [
  {
    path: '',
    component: AppSideLoginComponent,
    children: [
      // {
      //   path: 'login',
      //   component: AppSideLoginComponent,
      // },
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
    ],
  },
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./admin/admin-components.routes').then(
            (m) => m.AdminComponentsRoutes
          ),
      },
      // {
      //   path: 'login',
      //   loadChildren: () =>
      //     import('./pages/ui-components/ui-components.routes').then(
      //       (m) => m.UiComponentsRoutes
      //     ),
      // },
      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.routes').then((m) => m.ExtraRoutes),
      },
    ],
  },
  
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
