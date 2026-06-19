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
  templateUrl: './question-renderer.component.html',
  styleUrl: './question-renderer.component.scss',
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
