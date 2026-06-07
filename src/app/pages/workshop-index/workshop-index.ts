import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { WorkshopRegistry } from "../../services/workshop-registry";

/**
 *
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports:         [ RouterLink ],
  selector:        'app-workshop-index',
  styleUrl:        './workshop-index.css',
  templateUrl:     './workshop-index.html',
})
export class WorkshopIndex {
  private readonly registry = inject(WorkshopRegistry);

  protected readonly workshops = this.registry.all;
}
