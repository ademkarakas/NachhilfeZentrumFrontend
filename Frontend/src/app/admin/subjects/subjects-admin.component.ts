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
  templateUrl: './subjects-admin.component.html',
  styleUrl: './subjects-admin.component.scss',
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
