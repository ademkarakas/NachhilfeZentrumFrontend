import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { AdminApiService } from '../../core/api/admin-api.service';
import { ContentBlock } from '../../core/models/api.models';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmService } from '../shared/confirm-dialog.component';
import {
  CONTENT_PAGES,
  CONTENT_SECTIONS,
  ContentBlockFormDialogComponent,
  ContentBlockFormResult,
} from './content-block-form-dialog.component';

interface SectionGroup {
  key: string;
  label: string;
  items: ContentBlock[];
}

/**
 * Admin screen for repeating page sections (process steps, USP/benefit cards, target groups).
 * Blocks are filtered by page and grouped by section; each section is independently reorderable
 * via drag-and-drop. Mirrors the FAQ/Pricing admin pattern.
 */
@Component({
  selector: 'app-content-blocks-admin',
  imports: [MatButtonModule, MatFormFieldModule, MatSelectModule, DragDropModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './content-blocks-admin.component.html',
  styleUrl: './content-blocks-admin.component.scss',
})
export class ContentBlocksAdminComponent implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly dialog = inject(MatDialog);
  private readonly confirm = inject(ConfirmService);
  private readonly toast = inject(ToastService);

  readonly pages = CONTENT_PAGES;
  readonly all = signal<ContentBlock[]>([]);
  readonly page = signal<string>(CONTENT_PAGES[0].key);

  readonly groups = computed<SectionGroup[]>(() => {
    const blocks = this.all().filter((b) => b.pageKey === this.page());
    const byKey = new Map<string, ContentBlock[]>();
    for (const b of blocks) {
      (byKey.get(b.sectionKey) ?? byKey.set(b.sectionKey, []).get(b.sectionKey)!).push(b);
    }
    return [...byKey.entries()].map(([key, items]) => ({
      key,
      label: CONTENT_SECTIONS.find((s) => s.key === key)?.label ?? key,
      items: items.sort((a, b) => a.displayOrder - b.displayOrder),
    }));
  });

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.api.listContentBlocks().subscribe((b) => this.all.set(b));
  }

  setPage(key: string): void {
    this.page.set(key);
  }

  create(): void {
    this.dialog
      .open(ContentBlockFormDialogComponent, { data: { block: null, defaultPage: this.page() } })
      .afterClosed()
      .subscribe((result?: ContentBlockFormResult) => {
        if (!result) return;
        const displayOrder = this.all().filter(
          (b) => b.pageKey === result.pageKey && b.sectionKey === result.sectionKey,
        ).length;
        this.api.createContentBlock({ ...result, displayOrder }).subscribe(() => {
          this.toast.success('Block erstellt.');
          this.load();
        });
      });
  }

  edit(block: ContentBlock): void {
    this.dialog
      .open(ContentBlockFormDialogComponent, { data: { block, defaultPage: block.pageKey } })
      .afterClosed()
      .subscribe((result?: ContentBlockFormResult) => {
        if (!result) return;
        this.api.updateContentBlock(block.id, result).subscribe(() => {
          this.toast.success('Block aktualisiert.');
          this.load();
        });
      });
  }

  remove(block: ContentBlock): void {
    this.confirm
      .ask({
        title: 'Block löschen?',
        message: `„${block.title}" wird gelöscht.`,
        confirmText: 'Löschen',
        danger: true,
      })
      .subscribe((ok) => {
        if (!ok) return;
        this.api.deleteContentBlock(block.id).subscribe(() => {
          this.toast.success('Block gelöscht.');
          this.load();
        });
      });
  }

  drop(event: CdkDragDrop<ContentBlock[]>, group: SectionGroup): void {
    const list = [...group.items];
    moveItemInArray(list, event.previousIndex, event.currentIndex);
    // Reorder only this section's blocks; other sections are untouched.
    this.api.reorderContentBlocks(list.map((b) => b.id)).subscribe(() => this.load());
  }
}
