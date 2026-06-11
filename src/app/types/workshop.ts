export interface QuizOption {
  text:      string;
  correct:   boolean;
  feedback?: string;
}

export interface Quiz {
  question: string;
  options:  Array<QuizOption>;
}

export interface Tab {
  key:   string;
  label: string;
  html:  string;
}

export type BodyPart =
  | { type: "html"; html: string }
  | { type: "tabs"; tabs: Array<Tab> };

export interface Step {
  id:          string;
  title:       string;
  bodyParts:   Array<BodyPart>;
  quiz?:       Quiz;
  pausePoint?: string;
}

export interface Section {
  slug:  string;
  title: string;
  order: number;
  intro: string;
  steps: Array<Step>;
}

export interface Workshop {
  slug:         string;
  title:        string;
  tagline?:     string;
  description?: string;
  sections:     Array<Section>;
}
