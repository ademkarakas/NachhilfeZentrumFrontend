import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AdminApiService } from '../../core/api/admin-api.service';
import { Subject } from '../../core/models/api.models';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmService } from '../shared/confirm-dialog.component';
import {
  SubjectFormDialogComponent,
  SubjectFormResult,
} from './subject-form-dialog.component';

/**
 * Subjects CRUD — the reference admin pattern for this codebase. New admin modules
 * should follow this shape: MatTable list, create/edit dialog form, delete confirm
 * dialog, and CDK drag-drop reordering persisted via the reorder endpoint.
 */
@Component({
  selector: 'app-subjects-admin',
  imports: [MatTableModule, MatButtonModule, DragDropModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <h1>Fächer</h1>
      <button mat-flat-button color="primary" (click)="create()">Neues Fach</button>
    </header>

    @if (subjects().length === 0) {
      <p class="empty">Noch keine Fächer angelegt.</p>
    } @else {
      <p class="hint">Zeilen ziehen, um die Reihenfolge auf der Website zu ändern.</p>
      <table
        mat-table
        [dataSource]="subjects()"
        cdkDropList
        (cdkDropListDropped)="drop($event)"
        class="table"
      >
        <ng-container matColumnDef="order">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let s" class="drag-handle" cdkDragHandle>⠿</td>
        </ng-container>
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let s">{{ s.name }}</td>
        </ng-container>
        <ng-container matColumnDef="slug">
          <th mat-header-cell *matHeaderCellDef>Slug</th>
          <td mat-cell *matCellDef="let s">{{ s.slug }}</td>
        </ng-container>
        <ng-container matColumnDef="active">
          <th mat-header-cell *matHeaderCellDef>Sichtbar</th>
          <td mat-cell *matCellDef="let s">{{ s.isActive ? 'Ja' : 'Nein' }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let s" class="actions">
            <button mat-button (click)="edit(s)">Bearbeiten</button>
            <button mat-button color="warn" (click)="remove(s)">Löschen</button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns" cdkDrag></tr>
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
        overflow: hidden;
      }
      .drag-handle {
        cursor: move;
        color: var(--color-muted);
        width: 32px;
      }
      .actions {
        text-align: right;
        white-space: nowrap;
      }
      .hint,
      .empty {
        color: var(--color-muted);
      }
      .cdk-drag-preview {
        box-shadow: var(--shadow-lg);
        background: var(--color-surface);
      }
    `,
  ],
})
export class SubjectsAdminComponent implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly dialog = inject(MatDialog);
  private readonly confirm = inject(ConfirmService);
  private readonly toast = inject(ToastService);

  readonly subjects = signal<Subject[]>([]);
  readonly columns = ['order', 'name', 'slug', 'active', 'actions'];

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.api
      .listSubjects({ page: 1, pageSize: 100 })
      .subscribe((r) => this.subjects.set(r.items));
  }

  create(): void {
    this.dialog
      .open(SubjectFormDialogComponent, { data: null })
      .afterClosed()
      .subscribe((result?: SubjectFormResult) => {
        if (!result) {
          return;
        }
        this.api
          .createSubject({
            name: result.name,
            slug: result.slug,
            description: result.description,
            iconKey: result.iconKey,
            displayOrder: this.subjects().length,
          })
          .subscribe(() => {
            this.toast.success('Fach erstellt.');
            this.load();
          });
      });
  }

  edit(subject: Subject): void {
    this.dialog
      .open(SubjectFormDialogComponent, { data: subject })
      .afterClosed()
      .subscribe((result?: SubjectFormResult) => {
        if (!result) {
          return;
        }
        this.api.updateSubject(subject.id, result).subscribe(() => {
          this.toast.success('Fach aktualisiert.');
          this.load();
        });
      });
  }

  remove(subject: Subject): void {
    this.confirm
      .ask({
        title: 'Fach löschen?',
        message: `„${subject.name}“ wird ausgeblendet. Vergangene Tests bleiben erhalten.`,
        confirmText: 'Löschen',
        danger: true,
      })
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
        this.api.deleteSubject(subject.id).subscribe(() => {
          this.toast.success('Fach gelöscht.');
          this.load();
        });
      });
  }

  drop(event: CdkDragDrop<Subject[]>): void {
    const items = [...this.subjects()];
    moveItemInArray(items, event.previousIndex, event.currentIndex);
    this.subjects.set(items);
    this.api.reorderSubjects(items.map((s) => s.id)).subscribe({
      next: () => this.toast.success('Reihenfolge gespeichert.'),
      error: () => this.load(),
    });
  }
}
