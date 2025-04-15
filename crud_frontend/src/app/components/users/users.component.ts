import { Component } from '@angular/core';
import { UserListComponent } from "../user-list/user-list.component";

@Component({
  selector: 'app-users',
  imports: [ UserListComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

}
