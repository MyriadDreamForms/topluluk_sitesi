import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: ``,
  styles: []
})
export class ProfileComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    // Redirect to user's public profile
    const user = this.authService.currentUser();
    if (user) {
      this.router.navigate(['/u', user.username]);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
