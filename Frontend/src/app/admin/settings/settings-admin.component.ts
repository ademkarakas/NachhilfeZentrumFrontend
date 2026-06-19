import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { AdminApiService } from '../../core/api/admin-api.service';
import { ToastService } from '../../core/services/toast.service';
import { RichTextEditorComponent } from '../../shared/ui/rich-text-editor.component';

interface SettingRow {
  key: string;
  label: string;
  value: string;
  multiline?: boolean;
  rich?: boolean;
  group: string;
}

/** Lightweight key→value CMS for global site content — organized in tabs. */
@Component({
  selector: 'app-settings-admin',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    RichTextEditorComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings-admin.component.html',
  styleUrl: './settings-admin.component.scss',
})
export class SettingsAdminComponent implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly toast = inject(ToastService);

  // Known/managed settings. Unknown keys already in the store are appended on load.
  private readonly defaults: SettingRow[] = [
    // General
    { key: 'site.name', label: 'Name des Zentrums', value: '', group: 'general' },
    { key: 'site.tagline', label: 'Slogan', value: '', group: 'general' },
    { key: 'contact.email', label: 'Kontakt-E-Mail', value: '', group: 'general' },
    { key: 'contact.phone', label: 'Telefon', value: '', group: 'general' },
    { key: 'contact.address', label: 'Adresse', value: '', multiline: true, group: 'general' },
    {
      key: 'contact.openingHours',
      label: 'Öffnungszeiten',
      value: '',
      multiline: true,
      group: 'general',
    },
    { key: 'social.instagram', label: 'Instagram-URL', value: '', group: 'general' },
    { key: 'social.facebook', label: 'Facebook-URL', value: '', group: 'general' },
    { key: 'hero.title', label: 'Hero-Überschrift (Startseite)', value: '', group: 'general' },
    {
      key: 'home.heroText',
      label: 'Hero-Text (Startseite)',
      value: '',
      rich: true,
      group: 'general',
    },
    { key: 'hero.subtitle', label: 'Hero-Untertitel', value: '', rich: true, group: 'general' },
    {
      key: 'announcement.banner',
      label: 'Ankündigungs-Banner',
      value: '',
      rich: true,
      group: 'general',
    },
    // Stats
    { key: 'stats.students', label: 'Anzahl betreuter Schüler:innen', value: '', group: 'stats' },
    { key: 'stats.subjects', label: 'Anzahl Fächer', value: '', group: 'stats' },
    { key: 'stats.referralRate', label: 'Weiterempfehlungsrate (%)', value: '', group: 'stats' },
    { key: 'stats.yearsExperience', label: 'Jahre Erfahrung', value: '', group: 'stats' },
    // About
    {
      key: 'about.mission',
      label: 'Über uns — Mission (Einleitung)',
      value: '',
      rich: true,
      group: 'about',
    },
    { key: 'about.value1.title', label: 'Wert 1 — Titel', value: '', group: 'about' },
    {
      key: 'about.value1.description',
      label: 'Wert 1 — Beschreibung',
      value: '',
      rich: true,
      group: 'about',
    },
    { key: 'about.value2.title', label: 'Wert 2 — Titel', value: '', group: 'about' },
    {
      key: 'about.value2.description',
      label: 'Wert 2 — Beschreibung',
      value: '',
      rich: true,
      group: 'about',
    },
    { key: 'about.value3.title', label: 'Wert 3 — Titel', value: '', group: 'about' },
    {
      key: 'about.value3.description',
      label: 'Wert 3 — Beschreibung',
      value: '',
      rich: true,
      group: 'about',
    },
    // Legal
    { key: 'legal.impressum', label: 'Impressum', value: '', rich: true, group: 'legal' },
    {
      key: 'legal.datenschutz',
      label: 'Datenschutzerklärung',
      value: '',
      rich: true,
      group: 'legal',
    },
    { key: 'legal.agb', label: 'AGB', value: '', rich: true, group: 'legal' },
  ];

  readonly rows = signal<SettingRow[]>([]);
  readonly saving = signal(false);

  ngOnInit(): void {
    this.api.getSiteSettings().subscribe((settings) => {
      const known = this.defaults.map((d) => ({ ...d, value: settings[d.key] ?? '' }));
      const knownKeys = new Set(this.defaults.map((d) => d.key));
      const extra = Object.entries(settings)
        .filter(([key]) => !knownKeys.has(key))
        .map<SettingRow>(([key, value]) => ({ key, label: key, value, group: 'general' }));
      this.rows.set([...known, ...extra]);
    });
  }

  getGroup(group: string): SettingRow[] {
    return this.rows().filter((r) => r.group === group);
  }

  save(): void {
    this.saving.set(true);
    const map: Record<string, string> = {};
    for (const row of this.rows()) {
      map[row.key] = row.value;
    }
    this.api.updateSiteSettings(map).subscribe({
      next: () => {
        this.toast.success('Einstellungen gespeichert.');
        this.saving.set(false);
      },
      error: () => this.saving.set(false),
    });
  }
}
