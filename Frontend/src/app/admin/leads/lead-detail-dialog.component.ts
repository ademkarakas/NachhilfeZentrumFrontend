import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { AdminApiService } from '../../core/api/admin-api.service';
import { Lead } from '../../core/models/api.models';
import { LEAD_STATUS_LABELS, LeadStatus } from '../../core/models/enums';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-lead-detail-dialog',
  imports: [
    FormsModule,
    DatePipe,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>Anfrage von {{ lead.name }}</h2>
    <mat-dialog-content class="content">
      <dl class="facts">
        <dt>E-Mail</dt>
        <dd><a [href]="'mailto:' + lead.email">{{ lead.email }}</a></dd>
        @if (lead.phone) {
          <dt>Telefon</dt>
          <dd>{{ lead.phone }}</dd>
        }
        @if (lead.subjectOfInterest) {
          <dt>Interesse</dt>
          <dd>{{ lead.subjectOfInterest }}</dd>
        }
        <dt>Eingegangen</dt>
        <dd>{{ lead.createdAtUtc | date: 'dd.MM.yyyy HH:mm' }}</dd>
      </dl>

      <p class="message">{{ lead.message }}</p>

      <mat-form-field appearance="outline" class="full">
        <mat-label>Status</mat-label>
        <mat-select [(ngModel)]="status">
          @for (s of statuses; track s) {
            <mat-option [value]="s">{{ statusLabel(s) }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full">
        <mat-label>Interne Notizen</mat-label>
        <textarea matInput rows="4" [(ngModel)]="notes"></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Schließen</button>
      <button mat-flat-button color="primary" (click)="save()" [disabled]="saving()">
        Speichern
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .content {
        min-width: min(520px, 85vw);
      }
      .facts {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 0.25rem 1rem;
        margin: 0 0 1rem;
      }
      .facts dt {
        font-weight: 700;
        color: var(--color-muted);
      }
      .facts dd {
        margin: 0;
      }
      .message {
        background: var(--color-surface-alt);
        border-radius: var(--radius-sm);
        padding: 0.75rem 1rem;
        white-space: pre-line;
      }
      .full {
        width: 100%;
      }
    `,
  ],
})
export class LeadDetailDialogComponent {
  private readonly api = inject(AdminApiService);
  private readonly toast = inject(ToastService);
  readonly lead = inject<Lead>(MAT_DIALOG_DATA);

  status = this.lead.status;
  notes = this.lead.internalNotes ?? '';
  readonly saving = signal(false);
  readonly statuses = [LeadStatus.New, LeadStatus.Contacted, LeadStatus.Closed];

  statusLabel(s: LeadStatus): string {
    return LEAD_STATUS_LABELS[s];
  }

  save(): void {
    this.saving.set(true);
    const id = this.lead.id;
    // Persist status and notes; both are idempotent PUTs.
    this.api.setLeadStatus(id, this.status).subscribe(() => {
      this.api.setLeadNotes(id, this.notes || null).subscribe(() => {
        this.toast.success('Anfrage aktualisiert.');
        this.saving.set(false);
      });
    });
  }
}
