import { Injectable, signal, type Signal, type WritableSignal } from "@angular/core";

const STORAGE_KEY_PREFIX = "workshops:language:";
const DEFAULT_LANGUAGE = "python";

const safeLoad = (workshopSlug: string): string => {
  if (typeof localStorage === "undefined") {
    return DEFAULT_LANGUAGE;
  }
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${workshopSlug}`);
    return raw ?? DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
};

const safeSave = (workshopSlug: string, value: string): void => {
  if (typeof localStorage === "undefined") {
    return;
  }
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${workshopSlug}`, value);
  } catch {
    // Storage might be full or unavailable; silently ignore.
  }
};

/**
 *
 */
@Injectable({ providedIn: "root" })
export class LanguageService {
  private readonly byWorkshop = new Map<string, WritableSignal<string>>();

  /**
   * @param workshopSlug
   */
  public active(workshopSlug: string): Signal<string> {
    return this.getOrCreate(workshopSlug).asReadonly();
  }

  /**
   * @param workshopSlug
   * @param key
   */
  public setActive(workshopSlug: string, key: string): void {
    this.getOrCreate(workshopSlug).set(key);
    safeSave(workshopSlug, key);
  }

  private getOrCreate(workshopSlug: string): WritableSignal<string> {
    let existing = this.byWorkshop.get(workshopSlug);
    if (!existing) {
      existing = signal(safeLoad(workshopSlug));
      this.byWorkshop.set(workshopSlug, existing);
    }
    return existing;
  }
}
