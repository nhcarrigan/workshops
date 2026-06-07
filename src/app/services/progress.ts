import { Injectable, signal, computed, type Signal, type WritableSignal } from "@angular/core";

const STORAGE_KEY_PREFIX = "workshops:progress:";

const safeLoad = (workshopSlug: string): Record<string, boolean> => {
  if (typeof localStorage === "undefined") {
    return {};
  }
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${workshopSlug}`);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed === "object" && parsed !== null) {
      return parsed as Record<string, boolean>;
    }
    return {};
  } catch {
    return {};
  }
};

const safeSave = (workshopSlug: string, data: Record<string, boolean>): void => {
  if (typeof localStorage === "undefined") {
    return;
  }
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${workshopSlug}`, JSON.stringify(data));
  } catch {
    // Storage might be full or unavailable; silently ignore.
  }
};

/**
 *
 */
@Injectable({ providedIn: "root" })
export class ProgressService {
  private readonly byWorkshop = new Map<string, WritableSignal<Record<string, boolean>>>();

  /**
   * @param workshopSlug
   */
  public state(workshopSlug: string): Signal<Record<string, boolean>> {
    return this.getOrCreate(workshopSlug);
  }

  /**
   * @param workshopSlug
   * @param sectionSlug
   */
  public isSectionComplete(workshopSlug: string, sectionSlug: string): Signal<boolean> {
    const stateSignal = this.getOrCreate(workshopSlug);
    return computed(() => {
      return Boolean(stateSignal()[sectionSlug]);
    });
  }

  /**
   * @param workshopSlug
   * @param sectionSlug
   * @param complete
   */
  public markSection(workshopSlug: string, sectionSlug: string, complete: boolean): void {
    const stateSignal = this.getOrCreate(workshopSlug);
    const next = { ...stateSignal() };
    if (complete) {
      next[sectionSlug] = true;
    } else {
      delete next[sectionSlug];
    }
    stateSignal.set(next);
    safeSave(workshopSlug, next);
  }

  /**
   * @param workshopSlug
   */
  public resetWorkshop(workshopSlug: string): void {
    const stateSignal = this.getOrCreate(workshopSlug);
    stateSignal.set({});
    safeSave(workshopSlug, {});
  }

  private getOrCreate(workshopSlug: string): WritableSignal<Record<string, boolean>> {
    let existing = this.byWorkshop.get(workshopSlug);
    if (!existing) {
      existing = signal(safeLoad(workshopSlug));
      this.byWorkshop.set(workshopSlug, existing);
    }
    return existing;
  }
}
