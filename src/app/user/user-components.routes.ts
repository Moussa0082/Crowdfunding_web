import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';


export const UserComponentsRoutes: Routes = [
  {
    path: '',
    children: [
     
     
      {
        path: 'accueil',
        component: HomeComponent,
      },
    ],
  },
];
