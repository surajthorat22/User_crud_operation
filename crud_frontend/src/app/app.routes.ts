import { Routes } from '@angular/router';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UsersComponent } from './components/users/users.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full',
  },
  {
    path: 'userform',
    component: UserFormComponent,
  },
  {
    path: 'userform/:id',
    component: UserFormComponent,
  },
  {
    path: 'users/:id',
    component: UserDetailsComponent,
  },
  {
    path: 'users',
    component: UsersComponent,
  }
];
