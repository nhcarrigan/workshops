import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { WorkshopRegistry } from "../../services/workshop-registry";

/**
 *
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports:         [ RouterLink ],
  selector:        'app-workshop-home',
  styleUrl:        './workshop-home.css',
  templateUrl:     './workshop-home.html',
})
export class WorkshopHome {
  public readonly workshopSlug = input.required<string>();

  private readonly registry = inject(WorkshopRegistry);

  protected readonly workshop = computed(() => {
    return this.registry.getBySlug(this.workshopSlug());
  });

  protected readonly firstSectionSlug = computed(
    () => {
      return this.workshop()?.sections[0]?.slug;
    },
  );
}
