// DTO interfaces — mirror the backend Application-layer DTOs (see
// Backend/src/Application/Features/**). Shared by public site and admin module.
import {
  AssessmentDifficulty,
  AssessmentStatus,
  AttemptStatus,
  LeadStatus,
  MembershipTier,
  QuestionType,
  StaffKind,
  VisibilityLevel,
} from './enums';

// ── Shared envelopes ──────────────────────────────────────────────────────────
export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
  search?: string;
}

// ── Auth ────────────────────────────────────────────────────────────────────
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAtUtc: string;
  userId: string;
  email: string;
  fullName: string;
  roles: string[];
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  role?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  email?: string | null;
  currentPassword?: string | null;
  newPassword?: string | null;
}

// ── Subjects ──────────────────────────────────────────────────────────────────
export interface SubjectSummary {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  iconKey?: string | null;
  displayOrder: number;
}

export interface Subject extends SubjectSummary {
  isActive: boolean;
  createdAtUtc: string;
  updatedAtUtc?: string | null;
}

export interface CreateSubjectRequest {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  iconKey?: string | null;
  displayOrder: number;
}

export interface UpdateSubjectRequest {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  iconKey?: string | null;
  isActive: boolean;
}

// ── Coaching (distinct service line) ────────────────────────────────────────────
export interface CoachingProgramSummary {
  id: string;
  title: string;
  slug: string;
  description: string;
  targetAudience: string;
  ctaText?: string | null;
  ctaLink?: string | null;
  imageUrl?: string | null;
  displayOrder: number;
}

export interface CoachingProgram extends CoachingProgramSummary {
  outcomes: string;
  isActive: boolean;
  createdAtUtc: string;
  updatedAtUtc?: string | null;
}

export interface CreateCoachingProgramRequest {
  title: string;
  slug: string;
  description: string;
  targetAudience: string;
  outcomes: string;
  ctaText?: string | null;
  ctaLink?: string | null;
  imageUrl?: string | null;
  displayOrder: number;
}

export interface UpdateCoachingProgramRequest {
  title: string;
  slug: string;
  description: string;
  targetAudience: string;
  outcomes: string;
  ctaText?: string | null;
  ctaLink?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
}

// ── Assessments / Tests ─────────────────────────────────────────────────────────
export interface AssessmentListItem {
  id: string;
  title: string;
  slug: string;
  subjectId: string;
  difficulty: AssessmentDifficulty;
  estimatedDurationMinutes: number;
  status: AssessmentStatus;
  visibilityLevel: VisibilityLevel;
  questionCount: number;
  totalPoints: number;
}

// Public test-taking shapes (correct answers stripped server-side).
export interface PublicOption {
  id: string;
  text: string;
}

export interface PublicQuestion {
  id: string;
  type: QuestionType;
  text: string;
  points: number;
  order: number;
  allowMultiple: boolean;
  options: PublicOption[];
}

export interface PublicAssessment {
  id: string;
  title: string;
  slug: string;
  description: string;
  subjectId: string;
  difficulty: AssessmentDifficulty;
  estimatedDurationMinutes: number;
  totalPoints: number;
  questions: PublicQuestion[];
}

// Admin detail (includes correct answers).
export interface AdminOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface AdminQuestion {
  id: string;
  type: QuestionType;
  text: string;
  points: number;
  order: number;
  allowMultiple: boolean;
  options: AdminOption[];
}

export interface AssessmentAdminDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  subjectId: string;
  difficulty: AssessmentDifficulty;
  estimatedDurationMinutes: number;
  status: AssessmentStatus;
  visibilityLevel: VisibilityLevel;
  requiredTier?: MembershipTier | null;
  questions: AdminQuestion[];
}

export interface CreateTestRequest {
  title: string;
  slug: string;
  description: string;
  subjectId: string;
  difficulty: AssessmentDifficulty;
  estimatedDurationMinutes: number;
  requiresMembership: boolean;
}

export type UpdateTestMetadataRequest = CreateTestRequest;

export interface OptionInput {
  text: string;
  isCorrect: boolean;
}

export interface AddMcQuestionRequest {
  text: string;
  points: number;
  allowMultiple: boolean;
  options: OptionInput[];
}

// ── Attempts ────────────────────────────────────────────────────────────────────
export interface AnswerInput {
  questionId: string;
  selectedOptionIds: string[];
  freeText?: string | null;
}

export interface SubmitAttemptRequest {
  answers: AnswerInput[];
}

export interface AnswerResult {
  questionId: string;
  awardedPoints?: number | null;
  isCorrect?: boolean | null;
  requiresManualReview: boolean;
}

export interface AttemptResult {
  attemptId: string;
  assessmentId: string;
  status: AttemptStatus;
  score: number;
  maxScore: number;
  scorePercentage: number;
  answers: AnswerResult[];
}

// ── Leads ─────────────────────────────────────────────────────────────────────
export interface CreateLeadRequest {
  name: string;
  email: string;
  phone?: string | null;
  subjectOfInterest?: string | null;
  message: string;
}

export interface LeadListItem {
  id: string;
  name: string;
  email: string;
  subjectOfInterest?: string | null;
  status: LeadStatus;
  createdAtUtc: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subjectOfInterest?: string | null;
  message: string;
  status: LeadStatus;
  internalNotes?: string | null;
  createdAtUtc: string;
}

// ── Testimonials ────────────────────────────────────────────────────────────────
export interface Testimonial {
  id: string;
  authorName: string;
  authorRole?: string | null;
  quote: string;
  photoUrl?: string | null;
  subjectId?: string | null;
  displayOrder: number;
  isPublished: boolean;
}

export interface CreateTestimonialRequest {
  authorName: string;
  authorRole?: string | null;
  quote: string;
  photoUrl?: string | null;
  subjectId?: string | null;
  displayOrder: number;
  isPublished: boolean;
}

export interface UpdateTestimonialRequest {
  authorName: string;
  authorRole?: string | null;
  quote: string;
  photoUrl?: string | null;
  subjectId?: string | null;
  isPublished: boolean;
}

// ── Team ────────────────────────────────────────────────────────────────────────
export interface TeamMember {
  id: string;
  fullName: string;
  kind: StaffKind;
  title?: string | null;
  bio: string;
  photoUrl?: string | null;
  credentials?: string | null;
  subjectsTaught?: string | null;
  displayOrder: number;
  isPublished: boolean;
}

export interface CreateTeamMemberRequest {
  fullName: string;
  kind: StaffKind;
  title?: string | null;
  bio: string;
  photoUrl?: string | null;
  credentials?: string | null;
  subjectsTaught?: string | null;
  displayOrder: number;
  isPublished: boolean;
}

export interface UpdateTeamMemberRequest {
  fullName: string;
  kind: StaffKind;
  title?: string | null;
  bio: string;
  photoUrl?: string | null;
  credentials?: string | null;
  subjectsTaught?: string | null;
  isPublished: boolean;
}

// ── Site content + dashboard ─────────────────────────────────────────────────────
export type SiteSettings = Record<string, string>;

export interface DashboardStats {
  newLeads: number;
  publishedTests: number;
  attemptsLast7Days: number;
  attemptsLast30Days: number;
}

// ── FAQ ──────────────────────────────────────────────────────────────────────
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
  displayOrder: number;
  isPublished: boolean;
}

export interface CreateFaqItemRequest {
  question: string;
  answer: string;
  category?: string | null;
  displayOrder: number;
  isPublished: boolean;
}

export interface UpdateFaqItemRequest {
  question: string;
  answer: string;
  category?: string | null;
  isPublished: boolean;
}

// ── Content blocks (repeating page sections: steps, USP/benefit cards, …) ─────────
export interface ContentBlock {
  id: string;
  pageKey: string;
  sectionKey: string;
  iconKey?: string | null;
  title: string;
  body?: string | null;
  displayOrder: number;
  isPublished: boolean;
}

export interface CreateContentBlockRequest {
  pageKey: string;
  sectionKey: string;
  iconKey?: string | null;
  title: string;
  body?: string | null;
  displayOrder: number;
  isPublished: boolean;
}

export interface UpdateContentBlockRequest {
  pageKey: string;
  sectionKey: string;
  iconKey?: string | null;
  title: string;
  body?: string | null;
  isPublished: boolean;
}

// ── Pricing ─────────────────────────────────────────────────────────────────────
export interface PricingTier {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  priceUnit: string;
  features: string;
  isHighlighted: boolean;
  isCoachingVariant: boolean;
  ctaText?: string | null;
  ctaLink?: string | null;
  displayOrder: number;
  isPublished: boolean;
}

export interface CreatePricingTierRequest {
  name: string;
  subtitle: string;
  price: string;
  priceUnit: string;
  features: string;
  isHighlighted: boolean;
  isCoachingVariant: boolean;
  ctaText?: string | null;
  ctaLink?: string | null;
  displayOrder: number;
  isPublished: boolean;
}

export interface UpdatePricingTierRequest {
  name: string;
  subtitle: string;
  price: string;
  priceUnit: string;
  features: string;
  isHighlighted: boolean;
  isCoachingVariant: boolean;
  ctaText?: string | null;
  ctaLink?: string | null;
  isPublished: boolean;
}

/** RFC 7807 ProblemDetails shape returned by the API on failure. */
export interface ProblemDetails {
  title?: string;
  detail?: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// ── User Management ─────────────────────────────────────────────────────────────

export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
  isActive: boolean;
}

export interface CreateUserRequest {
  email: string;
  fullName: string;
  password: string;
  role: string;
}
