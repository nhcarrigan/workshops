import type { Routes } from "@angular/router";

export const routes: Routes = [
  {
    loadComponent: async() => {
      return await import("./pages/workshop-index/workshop-index").then((m) => {
        return m.WorkshopIndex;
      });
    },
    path: "",
  },
  {
    children: [
      {
        loadComponent: async() => {
          return await import("./pages/workshop-home/workshop-home").then((m) => {
            return m.WorkshopHome;
          });
        },
        path: "",
      },
      {
        loadComponent: async() => {
          return await import("./pages/section-page/section-page").then((m) => {
            return m.SectionPage;
          });
        },
        path: ":sectionSlug",
      },
    ],
    loadComponent: async() => {
      return await import("./pages/workshop-shell/workshop-shell").then((m) => {
        return m.WorkshopShell;
      });
    },
    path: ":workshopSlug",
  },
  {
    path:       "**",
    redirectTo: "",
  },
];
