import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { AppSideLoginComponent } from './pages/authentication/side-login/side-login.component';
import { AuthGuard } from './services/auth.guard';
import { HomeComponent } from './user/home/home.component';

export const routes: Routes = [
  // {
  //   path: '',
  //   component: AppSideLoginComponent,
  //   // canActivate: [AuthGuard]
  //   children: [
  //     // {
  //     //   path: 'login',
  //     //   component: AppSideLoginComponent,
  //     // },
  //     {
  //       path: 'authentication',
  //       loadChildren: () =>
  //         import('./pages/authentication/authentication.routes').then(
  //           (m) => m.AuthenticationRoutes
  //         ),
  //     },
  //   ],
  // },
  // {
  //   path: '',
  //   component: HomeComponent,
  //   // canActivate: [AuthGuard]
  //   children: [
  //     // {
  //     //   path: 'login',
  //     //   component: AppSideLoginComponent,
  //     // },
  //     {
  //       path: 'home',
  //       loadChildren: () =>
  //         import('./user/user-components.routes').then(
  //           (m) => m.UserComponentsRoutes
  //         ),
  //     },
  //   ],
  // },
  
 

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
