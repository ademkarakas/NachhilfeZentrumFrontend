import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/auth/auth.service';

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
  template: `
    <div class="admin-shell">
      <mat-toolbar class="bar">
        <a routerLink="/admin" class="bar__brand">Nachhilfezentrum · Admin</a>
        <span class="bar__spacer"></span>
        <span class="bar__user">{{ auth.email() }}</span>
        <a mat-button routerLink="/">Zur Website</a>
        <button mat-button (click)="logout()">Abmelden</button>
      </mat-toolbar>

      <mat-sidenav-container class="body">
        <mat-sidenav mode="side" opened class="nav">
          <mat-nav-list>
            @for (item of nav; track item.path) {
              <a
                mat-list-item
                [routerLink]="item.path"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: item.path === '/admin' }"
              >
                {{ item.label }}
              </a>
            }
          </mat-nav-list>
        </mat-sidenav>
        <mat-sidenav-content class="content">
          <router-outlet />
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [
    `
      .admin-shell {
        display: flex;
        flex-direction: column;
        height: 100vh;
      }
      .bar {
        z-index: 5;
      }
      .bar__brand {
        color: inherit;
        text-decoration: none;
        font-family: var(--font-display);
        font-weight: 600;
        font-size: var(--fs-lg);
      }
      .bar__spacer {
        flex: 1 1 auto;
      }
      .bar__user {
        font-size: 0.85rem;
        opacity: 0.8;
        margin-right: 0.5rem;
      }
      .body {
        flex: 1;
      }
      .nav {
        width: 240px;
        border-right: 1px solid var(--color-line);
      }
      .active {
        background: var(--color-primary-50);
        color: var(--color-primary-dark);
        font-weight: 700;
        box-shadow: inset 3px 0 0 var(--color-primary);
      }
      .content {
        padding: 1.5rem 2rem;
        background: var(--color-bg);
      }
    `,
  ],
})
export class AdminLayoutComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly nav: NavItem[] = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Fächer', path: '/admin/faecher' },
    { label: 'Coaching', path: '/admin/coaching' },
    { label: 'Tests', path: '/admin/tests' },
    { label: 'Anfragen', path: '/admin/anfragen' },
    { label: 'Testimonials', path: '/admin/testimonials' },
    { label: 'Team', path: '/admin/team' },
    { label: 'Einstellungen', path: '/admin/einstellungen' },
  ];

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
