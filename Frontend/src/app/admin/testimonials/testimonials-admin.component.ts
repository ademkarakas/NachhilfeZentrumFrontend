import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AdminApiService } from '../../core/api/admin-api.service';
import { Subject, Testimonial } from '../../core/models/api.models';
import { ToastService } from '../../core/services/toast.service';
import { RichTextEditorComponent } from '../../shared/ui/rich-text-editor.component';
import { StripHtmlPipe } from '../../shared/pipes/strip-html.pipe';
import { ConfirmService } from '../shared/confirm-dialog.component';

interface DialogData {
  testimonial: Testimonial | null;
  subjects: Subject[];
}

interface TestimonialFormResult {
  authorName: string;
  authorRole: string | null;
  quote: string;
  photoUrl: string | null;
  subjectId: string | null;
  isPublished: boolean;
}

@Component({
  selector: 'app-testimonial-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    RichTextEditorComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>{{ data.testimonial ? 'Testimonial bearbeiten' : 'Neues Testimonial' }}</h2>
    <form [formGroup]="form" (ngSubmit)="save()">
      <mat-dialog-content class="form">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="authorName" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Rolle (optional)</mat-label>
          <input matInput formControlName="authorRole" placeholder="z. B. Mutter von Lisa" />
        </mat-form-field>
        <div class="rte-field">
          <label class="rte-field__label">Zitat</label>
          <app-rich-text-editor formControlName="quote" [maxLength]="2000" />
        </div>
        <mat-form-field appearance="outline">
          <mat-label>Foto-URL (optional)</mat-label>
          <input matInput formControlName="photoUrl" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Bezug zu Fach (optional)</mat-label>
          <mat-select formControlName="subjectId">
            <mat-option [value]="null">— Keins —</mat-option>
            @for (s of data.subjects; track s.id) {
              <mat-option [value]="s.id">{{ s.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-checkbox formControlName="isPublished">Veröffentlicht</mat-checkbox>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" [mat-dialog-close]="undefined">Abbrechen</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">
          Speichern
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`.form { display: flex; flex-direction: column; min-width: min(480px, 85vw); padding-top: 0.5rem; }`],
})
export class TestimonialFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<TestimonialFormDialogComponent, TestimonialFormResult>);

  readonly form = this.fb.nonNullable.group({
    authorName: [this.data.testimonial?.authorName ?? '', [Validators.required]],
    authorRole: [this.data.testimonial?.authorRole ?? ''],
    quote: [this.data.testimonial?.quote ?? '', [Validators.required, Validators.maxLength(20000)]],
    photoUrl: [this.data.testimonial?.photoUrl ?? ''],
    subjectId: [this.data.testimonial?.subjectId ?? (null as string | null)],
    isPublished: [this.data.testimonial?.isPublished ?? true],
  });

  save(): void {
    if (this.form.invalid) {
      return;
    }
    const v = this.form.getRawValue();
    this.ref.close({
      authorName: v.authorName,
      authorRole: v.authorRole || null,
      quote: v.quote,
      photoUrl: v.photoUrl || null,
      subjectId: v.subjectId || null,
      isPublished: v.isPublished,
    });
  }
}

@Component({
  selector: 'app-testimonials-admin',
  imports: [MatTableModule, MatButtonModule, StripHtmlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <h1>Testimonials</h1>
      <button mat-flat-button color="primary" (click)="create()">Neues Testimonial</button>
    </header>

    @if (items().length === 0) {
      <p class="empty">Noch keine Testimonials angelegt.</p>
    } @else {
      <table mat-table [dataSource]="items()" class="table">
        <ng-container matColumnDef="author">
          <th mat-header-cell *matHeaderCellDef>Autor:in</th>
          <td mat-cell *matCellDef="let t">{{ t.authorName }}</td>
        </ng-container>
        <ng-container matColumnDef="quote">
          <th mat-header-cell *matHeaderCellDef>Zitat</th>
          <td mat-cell *matCellDef="let t" class="quote">{{ t.quote | stripHtml }}</td>
        </ng-container>
        <ng-container matColumnDef="published">
          <th mat-header-cell *matHeaderCellDef>Sichtbar</th>
          <td mat-cell *matCellDef="let t">{{ t.isPublished ? 'Ja' : 'Nein' }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let t" class="actions">
            <button mat-button (click)="edit(t)">Bearbeiten</button>
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
      .quote {
        max-width: 420px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .actions {
        text-align: right;
        white-space: nowrap;
      }
      .empty {
        color: var(--color-muted);
      }
    `,
  ],
})
export class TestimonialsAdminComponent implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly dialog = inject(MatDialog);
  private readonly confirm = inject(ConfirmService);
  private readonly toast = inject(ToastService);

  readonly items = signal<Testimonial[]>([]);
  readonly subjects = signal<Subject[]>([]);
  readonly columns = ['author', 'quote', 'published', 'actions'];

  ngOnInit(): void {
    this.load();
    this.api.listSubjects({ page: 1, pageSize: 100 }).subscribe((r) => this.subjects.set(r.items));
  }

  private load(): void {
    this.api.listTestimonials().subscribe((t) => this.items.set(t));
  }

  create(): void {
    this.dialog
      .open(TestimonialFormDialogComponent, {
        data: { testimonial: null, subjects: this.subjects() },
      })
      .afterClosed()
      .subscribe((result?: TestimonialFormResult) => {
        if (!result) {
          return;
        }
        this.api
          .createTestimonial({ ...result, displayOrder: this.items().length })
          .subscribe(() => {
            this.toast.success('Testimonial erstellt.');
            this.load();
          });
      });
  }

  edit(testimonial: Testimonial): void {
    this.dialog
      .open(TestimonialFormDialogComponent, {
        data: { testimonial, subjects: this.subjects() },
      })
      .afterClosed()
      .subscribe((result?: TestimonialFormResult) => {
        if (!result) {
          return;
        }
        this.api.updateTestimonial(testimonial.id, result).subscribe(() => {
          this.toast.success('Testimonial aktualisiert.');
          this.load();
        });
      });
  }

  remove(testimonial: Testimonial): void {
    this.confirm
      .ask({
        title: 'Testimonial löschen?',
        message: `Das Zitat von „${testimonial.authorName}“ wird gelöscht.`,
        confirmText: 'Löschen',
        danger: true,
      })
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
        this.api.deleteTestimonial(testimonial.id).subscribe(() => {
          this.toast.success('Testimonial gelöscht.');
          this.load();
        });
      });
  }
}
