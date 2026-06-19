import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AdminApiService } from '../../core/api/admin-api.service';
import { CoachingProgram } from '../../core/models/api.models';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmService } from '../shared/confirm-dialog.component';
import {
  CoachingFormDialogComponent,
  CoachingFormResult,
} from './coaching-form-dialog.component';

/** Coaching programs CRUD — a SEPARATE admin module from Subjects, by design. */
@Component({
  selector: 'app-coaching-admin',
  imports: [MatTableModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './coaching-admin.component.html',
  styleUrl: './coaching-admin.component.scss',
})
export class CoachingAdminComponent implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly dialog = inject(MatDialog);
  private readonly confirm = inject(ConfirmService);
  private readonly toast = inject(ToastService);

  readonly programs = signal<CoachingProgram[]>([]);
  readonly columns = ['title', 'audience', 'active', 'actions'];

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.api.listCoaching({ page: 1, pageSize: 100 }).subscribe((r) => this.programs.set(r.items));
  }

  create(): void {
    this.dialog
      .open(CoachingFormDialogComponent, { data: null })
      .afterClosed()
      .subscribe((result?: CoachingFormResult) => {
        if (!result) {
          return;
        }
        this.api
          .createCoaching({
            title: result.title,
            slug: result.slug,
            description: result.description,
            targetAudience: result.targetAudience,
            outcomes: result.outcomes,
            ctaText: result.ctaText,
            ctaLink: result.ctaLink,
            imageUrl: result.imageUrl,
            displayOrder: this.programs().length,
          })
          .subscribe(() => {
            this.toast.success('Programm erstellt.');
            this.load();
          });
      });
  }

  edit(program: CoachingProgram): void {
    this.dialog
      .open(CoachingFormDialogComponent, { data: program })
      .afterClosed()
      .subscribe((result?: CoachingFormResult) => {
        if (!result) {
          return;
        }
        this.api.updateCoaching(program.id, result).subscribe(() => {
          this.toast.success('Programm aktualisiert.');
          this.load();
        });
      });
  }

  remove(program: CoachingProgram): void {
    this.confirm
      .ask({
        title: 'Programm löschen?',
        message: `„${program.title}“ wird ausgeblendet.`,
        confirmText: 'Löschen',
        danger: true,
      })
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
        this.api.deleteCoaching(program.id).subscribe(() => {
          this.toast.success('Programm gelöscht.');
          this.load();
        });
      });
  }
}
