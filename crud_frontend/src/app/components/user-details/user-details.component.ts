import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, User } from '../../services/user.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';


@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ToastModule, AvatarModule, AvatarGroupModule],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
  providers: [MessageService]
})
export class UserDetailsComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  user: User | null = null;
  loading = true;

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.loadUser(userId);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'User ID not provided'
      });
      this.router.navigate(['/users']);
    }
  }

  loadUser(id: string): void {
    this.loading = true;
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load user details'
        });
        this.router.navigate(['/users']);
        this.loading = false;
      }
    });
  }

  onEdit(): void {
    if (this.user?._id) {
      this.router.navigate(['/userform', this.user._id]);
    }
  }

  onBack(): void {
    this.router.navigate(['/navbar']);
  }


  getBloodGroupClass(bloodGroup: string): string {
    const colorMap: Record<string, string> = {
      'A+': 'bg-red-100 text-red-800',
      'A-': 'bg-pink-100 text-pink-800',
      'B+': 'bg-blue-100 text-blue-800',
      'B-': 'bg-indigo-100 text-indigo-800',
      'O+': 'bg-green-100 text-green-800',
      'O-': 'bg-teal-100 text-teal-800',
      'AB+': 'bg-purple-100 text-purple-800',
      'AB-': 'bg-violet-100 text-violet-800',
    };

    return colorMap[bloodGroup] || 'bg-gray-100 text-gray-800';
  }
}
