import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AdminApiService } from '../../core/api/admin-api.service';
import { Subject, Testimonial } from '../../core/models/api.models';
import { ToastService } from '../../core/services/toast.service';
import { StripHtmlPipe } from '../../shared/pipes/strip-html.pipe';
import { ConfirmService } from '../shared/confirm-dialog.component';
import {
  TestimonialFormDialogComponent,
  TestimonialFormResult,
} from './testimonial-form-dialog.component';

@Component({
  selector: 'app-testimonials-admin',
  imports: [MatTableModule, MatButtonModule, StripHtmlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './testimonials-admin.component.html',
  styleUrl: './testimonials-admin.component.scss',
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
