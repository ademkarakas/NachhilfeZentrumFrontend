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
  templateUrl: './lead-detail-dialog.component.html',
  styleUrl: './lead-detail-dialog.component.scss',
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
