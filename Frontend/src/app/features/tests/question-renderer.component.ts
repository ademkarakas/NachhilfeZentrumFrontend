import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { PublicQuestion } from '../../core/models/api.models';
import { QuestionType } from '../../core/models/enums';

/**
 * Renders a single question by type. The `@switch(question.type)` is the FRONTEND half
 * of the polymorphic-question extensibility seam: adding a new question type later means
 * adding one new branch here (+ a backend subclass), never reworking the flow.
 *
 * Today only MultipleChoice is implemented; the reserved branches are intentional
 * placeholders so the shape is obvious to the next contributor.
 */
@Component({
  selector: 'app-question-renderer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let q = question();
    <fieldset class="q">
      <legend class="q__text">
        <span class="q__num">Frage {{ index() + 1 }}</span>
        {{ q.text }}
        <span class="q__points">{{ q.points }} {{ q.points === 1 ? 'Punkt' : 'Punkte' }}</span>
      </legend>

      @switch (q.type) {
        @case (QuestionType.MultipleChoice) {
          <div class="opts">
            @for (opt of q.options; track opt.id) {
              <label class="opt" [class.opt--checked]="isSelected(opt.id)">
                <input
                  [type]="q.allowMultiple ? 'checkbox' : 'radio'"
                  [name]="q.id"
                  [checked]="isSelected(opt.id)"
                  (change)="toggle(opt.id, q.allowMultiple)"
                />
                <span>{{ opt.text }}</span>
              </label>
            }
          </div>
          @if (q.allowMultiple) {
            <p class="hint">Mehrfachauswahl möglich.</p>
          }
        }
        @default {
          <!-- Reserved seam: TrueFalse / OpenEnded / FileUpload renderers go here. -->
          <p class="hint">Dieser Fragetyp wird noch nicht unterstützt.</p>
        }
      }
    </fieldset>
  `,
  styles: [
    `
      .q {
        border: 1px solid var(--color-line);
        border-radius: var(--radius);
        padding: var(--space-5);
        margin: 0 0 var(--space-5);
      }
      .q__text {
        font-weight: 600;
        color: var(--color-ink);
        font-size: var(--fs-lg);
        display: block;
        padding: 0;
      }
      .q__num {
        display: block;
        font-size: var(--fs-xs);
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--color-primary);
        font-weight: 700;
        margin-bottom: var(--space-1);
      }
      .q__points {
        display: inline-block;
        margin-left: var(--space-2);
        font-size: var(--fs-sm);
        color: var(--color-muted);
        font-weight: 500;
      }
      .opts {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        margin-top: var(--space-4);
      }
      .opt {
        display: flex;
        align-items: flex-start;
        gap: var(--space-3);
        padding: var(--space-3);
        border: 2px solid var(--color-line);
        border-radius: var(--radius-sm);
        background: var(--color-surface);
        color: var(--color-ink);
        cursor: pointer;
        transition:
          border-color var(--dur-base) var(--ease-out),
          background var(--dur-base) var(--ease-out);
      }
      .opt:hover {
        border-color: var(--color-primary-100);
      }
      .opt--checked {
        border-color: var(--color-primary);
        background: var(--color-primary-50);
        color: var(--color-ink);
      }
      .opt input {
        margin-top: 0.2rem;
        accent-color: var(--color-primary);
      }
      .hint {
        margin: var(--space-2) 0 0;
        font-size: var(--fs-sm);
        color: var(--color-muted);
      }
    `,
  ],
})
export class QuestionRendererComponent {
  readonly question = input.required<PublicQuestion>();
  readonly index = input(0);
  readonly selectedOptionIds = input<string[]>([]);
  readonly selectionChange = output<string[]>();

  protected readonly QuestionType = QuestionType;

  isSelected(optionId: string): boolean {
    return this.selectedOptionIds().includes(optionId);
  }

  toggle(optionId: string, allowMultiple: boolean): void {
    if (!allowMultiple) {
      this.selectionChange.emit([optionId]);
      return;
    }
    const current = this.selectedOptionIds();
    const next = current.includes(optionId)
      ? current.filter((id) => id !== optionId)
      : [...current, optionId];
    this.selectionChange.emit(next);
  }
}
