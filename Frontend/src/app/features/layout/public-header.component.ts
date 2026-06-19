import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ThemeService } from '../../core/theme/theme.service';
import { ButtonComponent } from '../../shared/ui/button.component';
import { IconComponent } from '../../shared/ui/icon.component';

/**
 * Public site header. Tutoring ("Nachhilfe") and Coaching are deliberately separate
 * top-level navigation items — coaching is never nested under subjects. The bar is
 * translucent at the top of the page and condenses (solid + shadow) once scrolled.
 */
@Component({
  selector: 'app-public-header',
  imports: [RouterLink, RouterLinkActive, ButtonComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="hdr" [class.hdr--scrolled]="scrolled()" [class.hdr--open]="open()">
      <div class="container hdr__inner">
        <a routerLink="/" class="hdr__brand" aria-label="Nachhilfezentrum Startseite">
          <span class="hdr__logo" aria-hidden="true">
            <app-icon name="graduation-cap" [size]="22" />
          </span>
          <span class="hdr__name">Nachhilfe<span class="hdr__name-accent">zentrum</span></span>
        </a>

        <button
          class="hdr__toggle"
          type="button"
          (click)="open.set(!open())"
          [attr.aria-expanded]="open()"
          aria-label="Menü umschalten"
        >
          <app-icon [name]="open() ? 'x' : 'menu'" [size]="24" />
        </button>

        <a href="tel:+4900000000000" class="hdr__phone" aria-label="Anrufen">
          <app-icon name="phone" [size]="16" />
          <span>0000 000 0000</span>
        </a>

        <nav class="hdr__nav" [class.hdr__nav--open]="open()" (click)="open.set(false)">
          <a routerLink="/faecher" routerLinkActive="active">Nachhilfe</a>
          <a routerLink="/coaching" routerLinkActive="active" class="nav--coaching">Coaching</a>
          <a routerLink="/tests" routerLinkActive="active">Tests</a>
          <a routerLink="/preise" routerLinkActive="active">Preise</a>
          <a routerLink="/team" routerLinkActive="active">Team</a>
          <a routerLink="/ueber-uns" routerLinkActive="active">Über uns</a>

          <span class="hdr__actions">
            <button
              class="hdr__theme"
              type="button"
              (click)="$event.stopPropagation(); theme.cycle()"
              [attr.aria-label]="themeLabel()"
              [title]="themeLabel()"
            >
              <app-icon [name]="themeIcon()" [size]="19" />
            </button>

            @if (auth.isBackOffice()) {
              <a routerLink="/admin" class="hdr__admin">Admin</a>
            }
            @if (auth.isAuthenticated()) {
              <button class="hdr__link-btn" type="button" (click)="auth.logout()">Abmelden</button>
            } @else {
              <a routerLink="/login" routerLinkActive="active">Anmelden</a>
            }
            <app-button link="/kontakt" size="md">Gratis Probestunde</app-button>
          </span>
        </nav>
      </div>
    </header>
  `,
  styles: [
    `
      .hdr {
        position: sticky;
        top: 0;
        z-index: 100;
        background: color-mix(in srgb, var(--color-bg) 70%, transparent);
        backdrop-filter: blur(12px) saturate(140%);
        border-bottom: 1px solid transparent;
        transition:
          background var(--dur-base) var(--ease-out),
          border-color var(--dur-base) var(--ease-out),
          box-shadow var(--dur-base) var(--ease-out);
      }
      .hdr--scrolled {
        background: color-mix(in srgb, var(--color-bg) 88%, transparent);
        border-bottom-color: var(--color-line);
        box-shadow: var(--shadow-sm);
      }
      .hdr__inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: var(--header-h);
        gap: var(--space-4);
        transition: min-height var(--dur-base) var(--ease-out);
      }
      .hdr--scrolled .hdr__inner {
        min-height: 64px;
      }
      .hdr__brand {
        display: inline-flex;
        align-items: center;
        gap: var(--space-3);
        font-weight: 800;
        color: var(--color-ink);
        text-decoration: none;
        font-size: var(--fs-lg);
        letter-spacing: -0.02em;
      }
      .hdr__brand:hover {
        text-decoration: none;
      }
      .hdr__name-accent {
        color: var(--color-primary);
      }
      .hdr__logo {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 12px;
        background: var(--grad-tutoring);
        color: #fff;
        box-shadow: var(--shadow-primary);
      }
      .hdr__nav {
        display: flex;
        align-items: center;
        gap: var(--space-5);
      }
      .hdr__nav a {
        position: relative;
        color: var(--color-body);
        font-weight: 600;
        text-decoration: none;
        padding: 0.25rem 0;
      }
      .hdr__nav a::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: -4px;
        height: 2px;
        background: currentColor;
        border-radius: 2px;
        transform: scaleX(0);
        transform-origin: left;
        transition: transform var(--dur-base) var(--ease-out);
      }
      .hdr__nav a:hover,
      .hdr__nav a.active {
        color: var(--color-primary);
        text-decoration: none;
      }
      .hdr__nav a:hover::after,
      .hdr__nav a.active::after {
        transform: scaleX(1);
      }
      .nav--coaching:hover,
      .nav--coaching.active {
        color: var(--color-coaching) !important;
      }
      .hdr__actions {
        display: flex;
        align-items: center;
        gap: var(--space-4);
      }
      .hdr__theme {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: var(--radius-full);
        border: 1px solid var(--color-line);
        background: var(--color-surface);
        color: var(--color-body);
        cursor: pointer;
        transition:
          color var(--dur-fast) var(--ease-out),
          border-color var(--dur-fast) var(--ease-out),
          transform var(--dur-fast) var(--ease-spring);
      }
      .hdr__theme:hover {
        color: var(--color-primary);
        border-color: var(--color-primary);
        transform: rotate(-12deg);
      }
      .hdr__admin {
        color: var(--color-coaching) !important;
      }
      .hdr__link-btn {
        background: none;
        border: none;
        font: inherit;
        font-weight: 600;
        color: var(--color-body);
        cursor: pointer;
        padding: 0;
      }
      .hdr__phone {
        display: none;
        align-items: center;
        gap: var(--space-2);
        color: var(--color-primary);
        font-weight: 700;
        font-size: var(--fs-sm);
        text-decoration: none;
        white-space: nowrap;
      }
      .hdr__phone:hover {
        color: var(--color-primary-dark);
        text-decoration: none;
      }
      @media (min-width: 921px) {
        .hdr__phone {
          display: inline-flex;
        }
      }
      .hdr__toggle {
        display: none;
        align-items: center;
        justify-content: center;
        background: none;
        border: none;
        color: var(--color-ink);
        cursor: pointer;
        padding: var(--space-2);
        margin: calc(var(--space-2) * -1);
      }
      @media (max-width: 920px) {
        .hdr__toggle {
          display: inline-flex;
        }
        .hdr__nav {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          flex-direction: column;
          align-items: flex-start;
          gap: var(--space-4);
          background: var(--color-surface);
          padding: var(--space-6) var(--space-5) var(--space-8);
          border-bottom: 1px solid var(--color-line);
          box-shadow: var(--shadow-lg);
          opacity: 0;
          transform: translateY(-12px);
          pointer-events: none;
          transition:
            opacity var(--dur-base) var(--ease-out),
            transform var(--dur-base) var(--ease-out);
        }
        .hdr__nav--open {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        .hdr__nav a {
          font-size: var(--fs-lg);
        }
        .hdr__actions {
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
          gap: var(--space-4);
          margin-top: var(--space-2);
        }
      }
    `,
  ],
})
export class PublicHeaderComponent {
  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);
  readonly open = signal(false);
  readonly scrolled = signal(false);

  readonly themeIcon = computed(() => {
    const pref = this.theme.preference();
    return pref === 'dark' ? 'moon' : pref === 'light' ? 'sun' : 'monitor';
  });

  readonly themeLabel = computed(() => {
    const pref = this.theme.preference();
    const current = pref === 'dark' ? 'Dunkel' : pref === 'light' ? 'Hell' : 'System';
    return `Farbschema: ${current} — umschalten`;
  });

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 8);
  }
}
