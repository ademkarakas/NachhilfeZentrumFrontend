import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../core/auth/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { EditProfileDialogComponent } from './edit-profile-dialog.component';

interface NavItem {
  label: string;
  path: string;
}

/**
 * Admin shell — data-dense layout (sidenav + toolbar), distinct from the marketing
 * site chrome. This is the only place Angular Material is imported.
 */
@Component({
  selector: 'app-admin-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly toast = inject(ToastService);

  readonly nav: NavItem[] = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Fächer', path: '/admin/faecher' },
    { label: 'Coaching', path: '/admin/coaching' },
    { label: 'Tests', path: '/admin/tests' },
    { label: 'Anfragen', path: '/admin/anfragen' },
    { label: 'Testimonials', path: '/admin/testimonials' },
    { label: 'Team', path: '/admin/team' },
    { label: 'FAQ', path: '/admin/faq' },
    { label: 'Preise', path: '/admin/preise' },
    { label: 'Seiteninhalte', path: '/admin/inhalte' },
    { label: 'Einstellungen', path: '/admin/einstellungen' },
    { label: 'Benutzer', path: '/admin/benutzer' },
  ];

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }

  openProfile(): void {
    const ref = this.dialog.open(EditProfileDialogComponent, {
      width: '440px',
      data: { fullName: this.auth.fullName(), email: this.auth.email() },
    });
    ref.afterClosed().subscribe((result) => {
      if (result) this.toast.success('Profil aktualisiert.');
    });
  }
}
