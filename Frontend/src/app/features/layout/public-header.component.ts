import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PublicApiService } from '../../core/api/public-api.service';
import { AuthService } from '../../core/auth/auth.service';
import { SubjectSummary } from '../../core/models/api.models';
import { SiteSettingsService } from '../../core/services/site-settings.service';
import { ThemeService } from '../../core/theme/theme.service';
import { IconComponent } from '../../shared/ui/icon.component';

/**
 * Public site header. Tutoring ("Nachhilfe") and Coaching are deliberately separate
 * top-level navigation items — coaching is never nested under subjects. The bar is
 * translucent at the top of the page and condenses (solid + shadow) once scrolled.
 */
@Component({
  selector: 'app-public-header',
  imports: [RouterLink, RouterLinkActive, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './public-header.component.html',
  styleUrl: './public-header.component.scss',
})
export class PublicHeaderComponent implements OnInit {
  readonly auth = inject(AuthService);
  readonly settings = inject(SiteSettingsService);
  readonly theme = inject(ThemeService);
  private readonly api = inject(PublicApiService);
  private readonly el = inject(ElementRef<HTMLElement>);

  readonly open = signal(false);
  readonly scrolled = signal(false);

  /** Subjects shown in the Nachhilfe dropdown (capped — the rest live behind "Alle Fächer"). */
  readonly subjects = signal<SubjectSummary[]>([]);
  readonly nachhilfeOpen = signal(false);
  /** Hover only opens the dropdown on desktop; touch/mobile rely on the chevron tap. */
  private readonly isDesktop = signal(
    typeof window !== 'undefined' ? window.innerWidth > 920 : true,
  );

  readonly themeIcon = computed(() => {
    const pref = this.theme.preference();
    return pref === 'dark' ? 'moon' : pref === 'light' ? 'sun' : 'monitor';
  });

  readonly themeLabel = computed(() => {
    const pref = this.theme.preference();
    const current = pref === 'dark' ? 'Dunkel' : pref === 'light' ? 'Hell' : 'System';
    return `Farbschema: ${current} — umschalten`;
  });

  ngOnInit(): void {
    this.api.getSubjects().subscribe((s) => this.subjects.set(s.slice(0, 8)));
  }

  onTriggerEnter(): void {
    if (this.isDesktop()) this.nachhilfeOpen.set(true);
  }

  onTriggerLeave(): void {
    if (this.isDesktop()) this.nachhilfeOpen.set(false);
  }

  toggleNachhilfe(event: Event): void {
    // Stop the click from bubbling to .hdr__collapse (which closes the mobile menu).
    event.stopPropagation();
    this.nachhilfeOpen.update((v) => !v);
  }

  closeNachhilfe(): void {
    this.nachhilfeOpen.set(false);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 8);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.isDesktop.set(window.innerWidth > 920);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.nachhilfeOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.nachhilfeOpen()) return;
    const dropdown = this.el.nativeElement.querySelector('.nav-dd');
    if (dropdown && !dropdown.contains(event.target as Node)) {
      this.nachhilfeOpen.set(false);
    }
  }
}
