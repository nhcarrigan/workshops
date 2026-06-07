export interface QuizOption {
  text:      string;
  correct:   boolean;
  feedback?: string;
}

export interface Quiz {
  question: string;
  options:  Array<QuizOption>;
}

export interface Step {
  id:          string;
  title:       string;
  bodyHtml:    string;
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
