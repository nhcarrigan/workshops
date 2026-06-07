import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { Step } from "../../components/step/step";
import { ProgressService } from "../../services/progress";
import { WorkshopRegistry } from "../../services/workshop-registry";

/**
 *
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports:         [ RouterLink, Step ],
  selector:        'app-section-page',
  styleUrl:        './section-page.css',
  templateUrl:     './section-page.html',
})
export class SectionPage {
  public readonly workshopSlug = input.required<string>();
  public readonly sectionSlug = input.required<string>();

  private readonly registry = inject(WorkshopRegistry);
  private readonly progressService = inject(ProgressService);
  private readonly router = inject(Router);

  protected readonly workshop = computed(() => {
    return this.registry.getBySlug(this.workshopSlug());
  });

  protected readonly section = computed(() => {
    return this.registry.getSection(this.workshopSlug(), this.sectionSlug());
  });

  protected readonly currentIndex = computed(() => {
    const workshop = this.workshop();
    if (!workshop) {
      return -1;
    }
    return workshop.sections.findIndex((s) => {
      return s.slug === this.sectionSlug();
    });
  });

  protected readonly previousSection = computed(() => {
    const workshop = this.workshop();
    const index = this.currentIndex();
    if (!workshop || index <= 0) {
      return undefined;
    }
    return workshop.sections[index - 1];
  });

  protected readonly nextSection = computed(() => {
    const workshop = this.workshop();
    const index = this.currentIndex();
    if (!workshop || index < 0 || index >= workshop.sections.length - 1) {
      return undefined;
    }
    return workshop.sections[index + 1];
  });

  protected readonly isComplete = computed(() => {
    return Boolean(this.progressService.state(this.workshopSlug())()[this.sectionSlug()]);
  });

  protected readonly continueLabel = computed(() => {
    const next = this.nextSection();
    return next
      ? `Mark complete & continue to ${next.title}`
      : "Mark complete & finish workshop";
  });

  protected async completeAndContinue(): Promise<void> {
    this.progressService.markSection(this.workshopSlug(), this.sectionSlug(), true);
    const next = this.nextSection();
    if (next) {
      await this.router.navigate([ "/", this.workshopSlug(), next.slug ]);
    } else {
      await this.router.navigate([ "/", this.workshopSlug() ]);
    }
  }
}
