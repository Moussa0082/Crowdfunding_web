import { Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContributionListComponent } from './contribution-list/contribution-list.component';
import { CategorieListComponent } from './categorie-list/categorie-list.component';
import { CampagneListComponent } from './campagne-list/campagne-list.component';


export const AdminComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'user-list',
        component: UserListComponent,
      },
      {
        path: 'contribution-list',
        component: ContributionListComponent,
      },
      {
        path: 'contact-list',
        component: ContactListComponent,
      },
      {
        path: 'categorie-list',
        component: CategorieListComponent,
      },
      {
        path: 'campagne-list',
        component: CampagneListComponent,
      },
    ],
  },
];
