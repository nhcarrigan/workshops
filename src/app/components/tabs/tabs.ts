import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
import type { Tab } from "../../types/workshop";
import { LanguageService } from "../../services/language";

/**
 *
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports:         [],
  selector:        'app-tabs',
  styleUrl:        './tabs.css',
  templateUrl:     './tabs.html',
})
export class Tabs {
  public readonly tabs = input.required<ReadonlyArray<Tab>>();
  public readonly workshopSlug = input.required<string>();

  private readonly language = inject(LanguageService);

  protected readonly activeTab = computed<Tab>(() => {
    const list = this.tabs();
    const preferred = this.language.active(this.workshopSlug())();
    return list.find((tab) => {
      return tab.key === preferred;
    }) ?? list[0];
  });

  protected pick(key: string): void {
    this.language.setActive(this.workshopSlug(), key);
  }
}
