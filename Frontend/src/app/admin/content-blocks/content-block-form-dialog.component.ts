import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { ContentBlock } from '../../core/models/api.models';

export interface ContentBlockFormResult {
  pageKey: string;
  sectionKey: string;
  iconKey: string | null;
  title: string;
  body: string | null;
  isPublished: boolean;
}

interface DialogData {
  block: ContentBlock | null;
  defaultPage: string;
}

/** Known pages and sections — kept in sync with the public pages that query them. */
export const CONTENT_PAGES: { key: string; label: string }[] = [
  { key: 'nachhilfe', label: 'Nachhilfe' },
  { key: 'coaching', label: 'Coaching' },
  { key: 'pricing', label: 'Preise' },
  { key: 'tests', label: 'Tests' },
];

export const CONTENT_SECTIONS: { key: string; label: string }[] = [
  { key: 'process-steps', label: 'Ablauf-Schritte' },
  { key: 'usps', label: 'Vorteile / USPs' },
  { key: 'benefits', label: 'Leistungen / Nutzen' },
  { key: 'target-groups', label: 'Zielgruppen' },
];

@Component({
  selector: 'app-content-block-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './content-block-form-dialog.component.html',
  styleUrl: './content-block-form-dialog.component.scss',
})
export class ContentBlockFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<ContentBlockFormDialogComponent, ContentBlockFormResult>);

  readonly pages = CONTENT_PAGES;
  readonly sections = CONTENT_SECTIONS;

  readonly form = this.fb.nonNullable.group({
    pageKey: [this.data.block?.pageKey ?? this.data.defaultPage, [Validators.required]],
    sectionKey: [this.data.block?.sectionKey ?? 'process-steps', [Validators.required]],
    iconKey: [this.data.block?.iconKey ?? ''],
    title: [this.data.block?.title ?? '', [Validators.required, Validators.maxLength(300)]],
    body: [this.data.block?.body ?? '', [Validators.maxLength(20000)]],
    isPublished: [this.data.block?.isPublished ?? true],
  });

  save(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    this.ref.close({
      pageKey: v.pageKey,
      sectionKey: v.sectionKey,
      iconKey: v.iconKey.trim() || null,
      title: v.title,
      body: v.body.trim() || null,
      isPublished: v.isPublished,
    });
  }
}
