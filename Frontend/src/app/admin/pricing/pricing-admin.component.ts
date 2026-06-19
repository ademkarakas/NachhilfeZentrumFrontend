import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AdminApiService } from '../../core/api/admin-api.service';
import { PricingTier } from '../../core/models/api.models';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmService } from '../shared/confirm-dialog.component';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { PricingFormDialogComponent, PricingFormResult } from './pricing-form-dialog.component';

@Component({
  selector: 'app-pricing-admin',
  imports: [MatTableModule, MatButtonModule, DragDropModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pricing-admin.component.html',
  styleUrl: './pricing-admin.component.scss',
})
export class PricingAdminComponent implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly dialog = inject(MatDialog);
  private readonly confirm = inject(ConfirmService);
  private readonly toast = inject(ToastService);

  readonly items = signal<PricingTier[]>([]);
  readonly columns = ['order', 'name', 'price', 'highlighted', 'published', 'actions'];

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.api.listPricing().subscribe((p) => this.items.set(p));
  }

  create(): void {
    this.dialog
      .open(PricingFormDialogComponent, { data: { tier: null } })
      .afterClosed()
      .subscribe((result?: PricingFormResult) => {
        if (!result) return;
        this.api
          .createPricingTier({ ...result, displayOrder: this.items().length })
          .subscribe(() => {
            this.toast.success('Preispaket erstellt.');
            this.load();
          });
      });
  }

  edit(tier: PricingTier): void {
    this.dialog
      .open(PricingFormDialogComponent, { data: { tier } })
      .afterClosed()
      .subscribe((result?: PricingFormResult) => {
        if (!result) return;
        this.api.updatePricingTier(tier.id, result).subscribe(() => {
          this.toast.success('Preispaket aktualisiert.');
          this.load();
        });
      });
  }

  remove(tier: PricingTier): void {
    this.confirm
      .ask({
        title: 'Preispaket löschen?',
        message: `„${tier.name}" wird gelöscht.`,
        confirmText: 'Löschen',
        danger: true,
      })
      .subscribe((ok) => {
        if (!ok) return;
        this.api.deletePricingTier(tier.id).subscribe(() => {
          this.toast.success('Preispaket gelöscht.');
          this.load();
        });
      });
  }

  drop(event: CdkDragDrop<PricingTier[]>): void {
    const list = [...this.items()];
    moveItemInArray(list, event.previousIndex, event.currentIndex);
    this.items.set(list);
    this.api.reorderPricingTiers(list.map((t) => t.id)).subscribe();
  }
}
