// Enum values mirror the backend Domain enums exactly. The API uses the default
// System.Text.Json behaviour (no string-enum converter), so enums travel over the
// wire as integers — these numeric values must stay in sync with the backend.

export enum QuestionType {
  MultipleChoice = 0,
  // Reserved seams — a new type means a new renderer branch + backend subclass.
  TrueFalse = 1,
  OpenEnded = 2,
  FileUpload = 3,
}

export enum AssessmentDifficulty {
  Easy = 0,
  Medium = 1,
  Hard = 2,
}

export enum AssessmentStatus {
  Draft = 0,
  Published = 1,
  Archived = 2,
}

/** Extensibility seam for a future Free/Pro tier. */
export enum VisibilityLevel {
  Public = 0,
  RequiresMembership = 1,
}

export enum MembershipTier {
  Free = 0,
  Pro = 1,
}

export enum AttemptStatus {
  InProgress = 0,
  Completed = 1,
  PendingReview = 2,
}

export enum LeadStatus {
  New = 0,
  Contacted = 1,
  Closed = 2,
}

export enum StaffKind {
  Tutor = 0,
  Coach = 1,
}

export const DIFFICULTY_LABELS: Record<AssessmentDifficulty, string> = {
  [AssessmentDifficulty.Easy]: 'Leicht',
  [AssessmentDifficulty.Medium]: 'Mittel',
  [AssessmentDifficulty.Hard]: 'Schwer',
};

export const STATUS_LABELS: Record<AssessmentStatus, string> = {
  [AssessmentStatus.Draft]: 'Entwurf',
  [AssessmentStatus.Published]: 'Veröffentlicht',
  [AssessmentStatus.Archived]: 'Archiviert',
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  [LeadStatus.New]: 'Neu',
  [LeadStatus.Contacted]: 'Kontaktiert',
  [LeadStatus.Closed]: 'Abgeschlossen',
};

export const STAFF_KIND_LABELS: Record<StaffKind, string> = {
  [StaffKind.Tutor]: 'Nachhilfelehrer:in',
  [StaffKind.Coach]: 'Coach',
};
