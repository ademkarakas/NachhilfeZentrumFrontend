import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AdminApiService } from '../../core/api/admin-api.service';
import { ToastService } from '../../core/services/toast.service';
import { RichTextEditorComponent } from '../../shared/ui/rich-text-editor.component';

interface SettingRow {
  key: string;
  label: string;
  value: string;
  multiline?: boolean;
  /** Long-form copy edited with the rich-text editor (sanitized as HTML on the server). */
  rich?: boolean;
}

/** Lightweight key→value CMS for global site content (contact details, hero copy, …). */
@Component({
  selector: 'app-settings-admin',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RichTextEditorComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <h1>Website-Einstellungen</h1>
    </header>

    <mat-card appearance="outlined">
      <mat-card-content>
        @for (row of rows(); track row.key) {
          @if (row.rich) {
            <div class="rte-field">
              <label class="rte-field__label">{{ row.label }}</label>
              <app-rich-text-editor [(ngModel)]="row.value" minHeight="6rem" />
              <span class="rte-field__hint">{{ row.key }}</span>
            </div>
          } @else {
            <mat-form-field appearance="outline" class="full">
              <mat-label>{{ row.label }}</mat-label>
              @if (row.multiline) {
                <textarea matInput rows="3" [(ngModel)]="row.value"></textarea>
              } @else {
                <input matInput [(ngModel)]="row.value" />
              }
              <mat-hint>{{ row.key }}</mat-hint>
            </mat-form-field>
          }
        }
        <div class="actions">
          <button mat-flat-button color="primary" (click)="save()" [disabled]="saving()">
            {{ saving() ? 'Speichern…' : 'Speichern' }}
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .page-head {
        margin-bottom: 1.5rem;
      }
      .full {
        width: 100%;
        display: block;
      }
      .actions {
        margin-top: 0.5rem;
      }
    `,
  ],
})
export class SettingsAdminComponent implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly toast = inject(ToastService);

  // Known/managed settings. Unknown keys already in the store are appended on load.
  private readonly defaults: SettingRow[] = [
    { key: 'site.name', label: 'Name des Zentrums', value: '' },
    { key: 'site.tagline', label: 'Slogan', value: '' },
    { key: 'contact.email', label: 'Kontakt-E-Mail', value: '' },
    { key: 'contact.phone', label: 'Telefon', value: '' },
    { key: 'contact.address', label: 'Adresse', value: '', multiline: true },
    { key: 'home.heroText', label: 'Hero-Text (Startseite)', value: '', rich: true },
    { key: 'hero.subtitle', label: 'Hero-Untertitel', value: '', rich: true },
    { key: 'announcement.banner', label: 'Ankündigungs-Banner', value: '', rich: true },
  ];

  readonly rows = signal<SettingRow[]>([]);
  readonly saving = signal(false);

  ngOnInit(): void {
    this.api.getSiteSettings().subscribe((settings) => {
      const known = this.defaults.map((d) => ({ ...d, value: settings[d.key] ?? '' }));
      const knownKeys = new Set(this.defaults.map((d) => d.key));
      const extra = Object.entries(settings)
        .filter(([key]) => !knownKeys.has(key))
        .map<SettingRow>(([key, value]) => ({ key, label: key, value }));
      this.rows.set([...known, ...extra]);
    });
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
