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
  templateUrl: './tests-admin.component.html',
  styleUrl: './tests-admin.component.scss',
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
