import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import type { QuizOption, Step as StepData } from '../../types/workshop';
import { Tabs } from '../tabs/tabs';

const shuffleOptions = (options: readonly QuizOption[]): QuizOption[] => {
  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

@Component({
  selector: 'app-step',
  imports: [Tabs],
  templateUrl: './step.html',
  styleUrl: './step.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Step {
  public readonly step = input.required<StepData>();
  public readonly workshopSlug = input.required<string>();

  protected readonly selectedOptionIndex = signal<number | undefined>(undefined);

  protected readonly shuffledOptions = computed<readonly QuizOption[]>(() => {
    const quiz = this.step().quiz;
    if (!quiz) {
      return [];
    }
    return shuffleOptions(quiz.options);
  });

  protected readonly selectedOption = computed(() => {
    const index = this.selectedOptionIndex();
    if (index === undefined) {
      return undefined;
    }
    return this.shuffledOptions()[index];
  });

  protected pick(index: number): void {
    this.selectedOptionIndex.set(index);
  }
}
