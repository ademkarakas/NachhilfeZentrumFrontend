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
  template: `
    <header class="page-head">
      <h1>Anfragen</h1>
    </header>

    <mat-button-toggle-group
      [value]="statusFilter()"
      (change)="onFilter($event.value)"
      class="filter"
    >
      <mat-button-toggle [value]="-1">Alle</mat-button-toggle>
      <mat-button-toggle [value]="Status.New">Neu</mat-button-toggle>
      <mat-button-toggle [value]="Status.Contacted">Kontaktiert</mat-button-toggle>
      <mat-button-toggle [value]="Status.Closed">Abgeschlossen</mat-button-toggle>
    </mat-button-toggle-group>

    @if (leads().length === 0) {
      <p class="empty">Keine Anfragen in dieser Ansicht.</p>
    } @else {
      <table mat-table [dataSource]="leads()" class="table">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let l">{{ l.name }}</td>
        </ng-container>
        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>E-Mail</th>
          <td mat-cell *matCellDef="let l">{{ l.email }}</td>
        </ng-container>
        <ng-container matColumnDef="subject">
          <th mat-header-cell *matHeaderCellDef>Interesse</th>
          <td mat-cell *matCellDef="let l">{{ l.subjectOfInterest || '—' }}</td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let l">{{ statusLabel(l.status) }}</td>
        </ng-container>
        <ng-container matColumnDef="created">
          <th mat-header-cell *matHeaderCellDef>Datum</th>
          <td mat-cell *matCellDef="let l">{{ l.createdAtUtc | date: 'dd.MM.yyyy' }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let l" class="actions">
            <button mat-button color="primary" (click)="open(l)">Öffnen</button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns"></tr>
      </table>
    }
  `,
  styles: [
    `
      .page-head {
        margin-bottom: 1rem;
      }
      .filter {
        margin-bottom: 1.5rem;
      }
      .table {
        width: 100%;
        background: var(--color-surface);
        border-radius: var(--radius);
      }
      .actions {
        text-align: right;
      }
      .empty {
        color: var(--color-muted);
      }
    `,
  ],
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
