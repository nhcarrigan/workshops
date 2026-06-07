import { Injectable, computed, signal } from "@angular/core";
import { WORKSHOPS } from "../generated/workshops";
import type { Section, Workshop } from "../types/workshop";

/**
 *
 */
@Injectable({ providedIn: "root" })
export class WorkshopRegistry {
  private readonly workshopsSignal = signal<ReadonlyArray<Workshop>>(WORKSHOPS);
  public readonly all = computed(() => {
    return this.workshopsSignal();
  });

  /**
   * @param slug
   */
  public getBySlug(slug: string): Workshop | undefined {
    return this.workshopsSignal().find((workshop) => {
      return workshop.slug === slug;
    });
  }

  /**
   * @param workshopSlug
   * @param sectionSlug
   */
  public getSection(workshopSlug: string, sectionSlug: string): Section | undefined {
    return this.getBySlug(workshopSlug)?.sections.find(
      (section) => {
        return section.slug === sectionSlug;
      },
    );
  }
}
