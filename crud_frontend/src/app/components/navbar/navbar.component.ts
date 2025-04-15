import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MenubarModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    FormsModule
  ],
  providers: [MessageService]
})
export class NavbarComponent {
  showUserDialog = false;
  userId = '';
  items: MenuItem[] = [];

  constructor(
    private readonly router: Router,
    private readonly messageService: MessageService
  ) {}

  navigateToAddUser() {
    this.router.navigate(['/userform']);
  }

  showUpdateUserDialog() {
    this.showUserDialog = true;
  }

  showViewUserDialog() {
    this.showUserDialog = true;
  }

  handleUserAction(action: 'view' | 'update') {
    if (!this.userId.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter a valid User ID'
      });
      return;
    }

    if (action === 'view') {
      this.router.navigate(['/userdetails', this.userId]);
    } else {
      this.router.navigate(['/userform', this.userId]);
    }

    this.showUserDialog = false;
    this.userId = '';
  }

  navigateToGetAllUsers() {
    this.router.navigate(['/userlist']);
  }
}
