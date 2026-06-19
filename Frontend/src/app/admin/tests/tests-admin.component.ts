import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { AdminApiService } from '../../core/api/admin-api.service';
import { AssessmentListItem } from '../../core/models/api.models';
import { AssessmentStatus, STATUS_LABELS, DIFFICULTY_LABELS } from '../../core/models/enums';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmService } from '../shared/confirm-dialog.component';
import { TestFormDialogComponent, TestFormResult } from './test-form-dialog.component';

@Component({
  selector: 'app-tests-admin',
  imports: [MatTableModule, MatButtonModule, MatChipsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <h1>Tests</h1>
      <button mat-flat-button color="primary" (click)="create()">Neuer Test</button>
    </header>

    @if (tests().length === 0) {
      <p class="empty">Noch keine Tests angelegt.</p>
    } @else {
      <table mat-table [dataSource]="tests()" class="table">
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef>Titel</th>
          <td mat-cell *matCellDef="let t">{{ t.title }}</td>
        </ng-container>
        <ng-container matColumnDef="difficulty">
          <th mat-header-cell *matHeaderCellDef>Niveau</th>
          <td mat-cell *matCellDef="let t">{{ difficultyLabel(t.difficulty) }}</td>
        </ng-container>
        <ng-container matColumnDef="questions">
          <th mat-header-cell *matHeaderCellDef>Fragen</th>
          <td mat-cell *matCellDef="let t">{{ t.questionCount }}</td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let t">
            <span class="chip chip--{{ t.status }}">{{ statusLabel(t.status) }}</span>
          </td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let t" class="actions">
            <button mat-button (click)="openEditor(t)">Fragen</button>
            @if (t.status === Status.Published) {
              <button mat-button (click)="unpublish(t)">Zurückziehen</button>
            } @else {
              <button mat-button color="primary" (click)="publish(t)">Veröffentlichen</button>
            }
            <button mat-button color="warn" (click)="remove(t)">Löschen</button>
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
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1.5rem;
      }
      .table {
        width: 100%;
        background: var(--color-surface);
        border-radius: var(--radius);
      }
      .actions {
        text-align: right;
        white-space: nowrap;
      }
      .empty {
        color: var(--color-muted);
      }
      .chip {
        font-size: 0.75rem;
        font-weight: 700;
        padding: 0.15rem 0.6rem;
        border-radius: var(--radius-full);
        background: var(--color-surface-sunken);
        color: var(--color-muted);
      }
      .chip--1 {
        background: var(--color-primary-50);
        color: var(--color-primary-dark);
      }
      .chip--2 {
        background: color-mix(in srgb, var(--color-danger) 14%, var(--color-surface));
        color: var(--color-danger);
      }
    `,
  ],
})
export class TestsAdminComponent implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly dialog = inject(MatDialog);
  private readonly confirm = inject(ConfirmService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  readonly tests = signal<AssessmentListItem[]>([]);
  readonly columns = ['title', 'difficulty', 'questions', 'status', 'actions'];
  protected readonly Status = AssessmentStatus;

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.api.listTests({ page: 1, pageSize: 100 }).subscribe((r) => this.tests.set(r.items));
  }

  create(): void {
    this.dialog
      .open(TestFormDialogComponent, { data: null })
      .afterClosed()
      .subscribe((result?: TestFormResult) => {
        if (!result) {
          return;
        }
        this.api.createTest(result).subscribe((detail) => {
          this.toast.success('Test erstellt — jetzt Fragen hinzufügen.');
          this.router.navigate(['/admin/tests', detail.id]);
        });
      });
  }

  openEditor(test: AssessmentListItem): void {
    this.router.navigate(['/admin/tests', test.id]);
  }

  publish(test: AssessmentListItem): void {
    this.api.publishTest(test.id).subscribe({
      next: () => {
        this.toast.success('Test veröffentlicht.');
        this.load();
      },
      error: () => this.toast.error('Veröffentlichen fehlgeschlagen — hat der Test Fragen?'),
    });
  }

  unpublish(test: AssessmentListItem): void {
    this.api.unpublishTest(test.id).subscribe(() => {
      this.toast.success('Test zurückgezogen.');
      this.load();
    });
  }

  remove(test: AssessmentListItem): void {
    this.confirm
      .ask({
        title: 'Test löschen?',
        message: `„${test.title}“ wird gelöscht.`,
        confirmText: 'Löschen',
        danger: true,
      })
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
        this.api.deleteTest(test.id).subscribe(() => {
          this.toast.success('Test gelöscht.');
          this.load();
        });
      });
  }

  difficultyLabel(d: number): string {
    return DIFFICULTY_LABELS[d as keyof typeof DIFFICULTY_LABELS];
  }

  statusLabel(s: AssessmentStatus): string {
    return STATUS_LABELS[s];
  }
}
