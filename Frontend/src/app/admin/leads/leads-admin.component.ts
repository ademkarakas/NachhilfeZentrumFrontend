import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { AdminApiService } from '../../core/api/admin-api.service';
import { LeadListItem } from '../../core/models/api.models';
import { LEAD_STATUS_LABELS, LeadStatus } from '../../core/models/enums';
import { LeadDetailDialogComponent } from './lead-detail-dialog.component';

@Component({
  selector: 'app-leads-admin',
  imports: [DatePipe, MatTableModule, MatButtonModule, MatButtonToggleModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './leads-admin.component.html',
  styleUrl: './leads-admin.component.scss',
})
export class LeadsAdminComponent implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly dialog = inject(MatDialog);

  readonly leads = signal<LeadListItem[]>([]);
  readonly statusFilter = signal<number>(-1);
  readonly columns = ['name', 'email', 'subject', 'status', 'created', 'actions'];
  protected readonly Status = LeadStatus;

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    const status = this.statusFilter();
    this.api
      .listLeads({
        page: 1,
        pageSize: 100,
        status: status === -1 ? undefined : (status as LeadStatus),
      })
      .subscribe((r) => this.leads.set(r.items));
  }

  onFilter(value: number): void {
    this.statusFilter.set(value);
    this.load();
  }

  open(item: LeadListItem): void {
    this.api.getLead(item.id).subscribe((lead) => {
      this.dialog
        .open(LeadDetailDialogComponent, { data: lead })
        .afterClosed()
        .subscribe(() => this.load());
    });
  }

  statusLabel(s: LeadStatus): string {
    return LEAD_STATUS_LABELS[s];
  }
}
