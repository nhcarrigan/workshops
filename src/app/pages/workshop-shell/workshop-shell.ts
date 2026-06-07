import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { ProgressService } from "../../services/progress";
import { WorkshopRegistry } from "../../services/workshop-registry";

/**
 *
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports:         [ RouterLink, RouterLinkActive, RouterOutlet ],
  selector:        'app-workshop-shell',
  styleUrl:        './workshop-shell.css',
  templateUrl:     './workshop-shell.html',
})
export class WorkshopShell {
  public readonly workshopSlug = input.required<string>();

  private readonly registry = inject(WorkshopRegistry);
  private readonly progressService = inject(ProgressService);

  protected readonly workshop = computed(() => {
    return this.registry.getBySlug(this.workshopSlug());
  });

  protected readonly progressFraction = computed(() => {
    const workshop = this.workshop();
    if (!workshop) {
      return 0;
    }
    if (workshop.sections.length === 0) {
      return 0;
    }
    const state = this.progressService.state(workshop.slug)();
    const completed = workshop.sections.filter((section) => {
      return state[section.slug];
    }).length;
    return completed / workshop.sections.length;
  });

  protected readonly progressPercent = computed(() => {
    return Math.round(this.progressFraction() * 100);
  });

  protected sectionIsComplete(sectionSlug: string): boolean {
    return Boolean(this.progressService.state(this.workshopSlug())()[sectionSlug]);
  }
}
