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
  template: `
    <div class="rte" [class.rte--disabled]="disabled()">
      @if (isBrowser) {
        <quill-editor
          [ngModel]="value()"
          [modules]="modules"
          [placeholder]="placeholder()"
          [readOnly]="disabled()"
          format="html"
          [styles]="{ minHeight: minHeight() }"
          (onContentChanged)="onContentChanged($event)"
          (onBlur)="onTouched()"
        />
      } @else {
        <div class="rte__ssr" [style.min-height]="minHeight()"></div>
      }

      @if (maxLength()) {
        <div class="rte__count" [class.rte__count--over]="textLength() > maxLength()!">
          {{ textLength() }} / {{ maxLength() }}
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .rte__count {
        text-align: right;
        font-size: var(--fs-xs);
        color: var(--color-muted);
        margin-top: var(--space-1);
      }
      .rte__count--over {
        color: var(--color-danger);
        font-weight: 700;
      }
      .rte__ssr {
        border: 1px solid var(--color-line);
        border-radius: var(--radius-sm);
        background: var(--color-surface);
      }
      .rte--disabled {
        opacity: 0.6;
      }

      // ── Theme the Quill "snow" chrome to the design system. ngx-quill renders its own
      //    DOM, so we reach it via ::ng-deep (scoped to :host). Dark mode falls out of the
      //    CSS custom properties automatically. ──
      :host ::ng-deep {
        .ql-toolbar.ql-snow,
        .ql-container.ql-snow {
          border-color: var(--color-line);
          font-family: var(--font-sans);
        }
        .ql-toolbar.ql-snow {
          border-top-left-radius: var(--radius-sm);
          border-top-right-radius: var(--radius-sm);
          background: var(--color-surface-alt);
        }
        .ql-container.ql-snow {
          border-bottom-left-radius: var(--radius-sm);
          border-bottom-right-radius: var(--radius-sm);
          background: var(--color-surface);
          color: var(--color-body);
          font-size: var(--fs-base);
        }
        .ql-editor {
          min-height: inherit;
        }
        .ql-editor.ql-blank::before {
          color: var(--color-muted);
          font-style: normal;
        }
        // Toolbar icons / labels follow the text color so dark mode works.
        .ql-snow .ql-stroke {
          stroke: var(--color-body);
        }
        .ql-snow .ql-fill {
          fill: var(--color-body);
        }
        .ql-snow .ql-picker {
          color: var(--color-body);
        }
        // Active / hover states use the brand color.
        .ql-snow .ql-toolbar button:hover .ql-stroke,
        .ql-snow button.ql-active .ql-stroke {
          stroke: var(--color-primary);
        }
        .ql-snow .ql-toolbar button:hover .ql-fill,
        .ql-snow button.ql-active .ql-fill {
          fill: var(--color-primary);
        }
        .ql-snow button.ql-active,
        .ql-snow .ql-picker-label:hover,
        .ql-snow button:hover {
          color: var(--color-primary);
        }
        // Link tooltip / picker dropdowns on dark surfaces.
        .ql-snow .ql-picker-options {
          background: var(--color-surface);
          border-color: var(--color-line);
        }
        .ql-snow .ql-tooltip {
          background: var(--color-surface);
          color: var(--color-body);
          border-color: var(--color-line);
          box-shadow: var(--shadow-md);
        }
        .ql-snow .ql-tooltip input[type='text'] {
          background: var(--color-surface);
          color: var(--color-body);
          border-color: var(--color-line);
        }
      }
    `,
  ],
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
