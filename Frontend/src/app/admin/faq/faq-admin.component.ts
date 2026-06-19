import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AdminApiService } from '../../core/api/admin-api.service';
import { FaqItem } from '../../core/models/api.models';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmService } from '../shared/confirm-dialog.component';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { FaqFormDialogComponent, FaqFormResult } from './faq-form-dialog.component';

@Component({
  selector: 'app-faq-admin',
  imports: [MatTableModule, MatButtonModule, DragDropModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './faq-admin.component.html',
  styleUrl: './faq-admin.component.scss',
})
export class FaqAdminComponent implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly dialog = inject(MatDialog);
  private readonly confirm = inject(ConfirmService);
  private readonly toast = inject(ToastService);

  readonly items = signal<FaqItem[]>([]);
  readonly columns = ['order', 'question', 'category', 'published', 'actions'];

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.api.listFaq().subscribe((f) => this.items.set(f));
  }

  create(): void {
    this.dialog
      .open(FaqFormDialogComponent, { data: { faqItem: null } })
      .afterClosed()
      .subscribe((result?: FaqFormResult) => {
        if (!result) return;
        this.api.createFaqItem({ ...result, displayOrder: this.items().length }).subscribe(() => {
          this.toast.success('FAQ erstellt.');
          this.load();
        });
      });
  }

  edit(faqItem: FaqItem): void {
    this.dialog
      .open(FaqFormDialogComponent, { data: { faqItem } })
      .afterClosed()
      .subscribe((result?: FaqFormResult) => {
        if (!result) return;
        this.api.updateFaqItem(faqItem.id, result).subscribe(() => {
          this.toast.success('FAQ aktualisiert.');
          this.load();
        });
      });
  }

  remove(faqItem: FaqItem): void {
    this.confirm
      .ask({
        title: 'FAQ löschen?',
        message: `„${faqItem.question}" wird gelöscht.`,
        confirmText: 'Löschen',
        danger: true,
      })
      .subscribe((ok) => {
        if (!ok) return;
        this.api.deleteFaqItem(faqItem.id).subscribe(() => {
          this.toast.success('FAQ gelöscht.');
          this.load();
        });
      });
  }

  drop(event: CdkDragDrop<FaqItem[]>): void {
    const list = [...this.items()];
    moveItemInArray(list, event.previousIndex, event.currentIndex);
    this.items.set(list);
    this.api.reorderFaqItems(list.map((f) => f.id)).subscribe();
  }
}
