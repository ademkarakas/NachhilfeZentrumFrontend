import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  computed,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ContentChange, QuillEditorComponent } from 'ngx-quill';

/**
 * Design-system rich-text editor — a thin, themed wrapper around ngx-quill that plugs into
 * Reactive Forms like a normal control (drop-in replacement for a <textarea> bound with
 * formControlName). The toolbar is intentionally limited to the formats the backend
 * HtmlSanitizer allows (bold/italic/underline/strike, H2/H3, lists, blockquote, link) — any
 * richer markup would be stripped on save, so we don't offer it.
 *
 * The stored value is an HTML string. The character counter measures *visible text* length,
 * not HTML length, so it matches what the editor shows. SSR renders a static placeholder
 * (the editor is admin-only and never indexed).
 */
@Component({
  selector: 'app-rich-text-editor',
  imports: [FormsModule, QuillEditorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true,
    },
  ],
  templateUrl: './rich-text-editor.component.html',
  styleUrl: './rich-text-editor.component.scss',
})
export class RichTextEditorComponent implements ControlValueAccessor {
  private readonly platformId = inject(PLATFORM_ID);
  readonly isBrowser = isPlatformBrowser(this.platformId);

  /** Placeholder shown when the editor is empty. */
  readonly placeholder = input('Text eingeben …');
  /** Soft character budget (visible text). Shows a counter; does not hard-block. */
  readonly maxLength = input<number | null>(null);
  /** Editor min-height, e.g. '8rem'. */
  readonly minHeight = input('8rem');

  readonly value = signal('');
  readonly textLength = signal(0);
  readonly disabled = signal(false);

  // Toolbar mirrors the backend sanitizer allow-list — nothing the editor offers is stripped.
  readonly modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ header: 2 }, { header: 3 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'link'],
      ['clean'],
    ],
  };

  private onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  onContentChanged(event: ContentChange): void {
    this.textLength.set((event.text ?? '').replace(/\n+$/, '').length);
    // Ignore programmatic updates (source 'api') so writeValue() doesn't fire onChange.
    if (event.source !== 'user') {
      return;
    }
    const html = event.html ?? '';
    this.value.set(html);
    this.onChange(html);
  }

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
