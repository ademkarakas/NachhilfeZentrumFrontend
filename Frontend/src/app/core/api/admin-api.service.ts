import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AddMcQuestionRequest,
  AssessmentAdminDetail,
  AssessmentListItem,
  CoachingProgram,
  CreateCoachingProgramRequest,
  CreateFaqItemRequest,
  CreatePricingTierRequest,
  CreateSubjectRequest,
  CreateTeamMemberRequest,
  CreateTestRequest,
  CreateTestimonialRequest,
  DashboardStats,
  FaqItem,
  Lead,
  LeadListItem,
  PagedResult,
  PaginationQuery,
  PricingTier,
  SiteSettings,
  Subject,
  TeamMember,
  Testimonial,
  UpdateCoachingProgramRequest,
  UpdateFaqItemRequest,
  UpdatePricingTierRequest,
  UpdateSubjectRequest,
  UpdateTeamMemberRequest,
  UpdateTestMetadataRequest,
  UpdateTestimonialRequest,
  UserDto,
  CreateUserRequest,
} from '../models/api.models';
import { AssessmentStatus, LeadStatus } from '../models/enums';

/** Back-office API (requires Admin/Editor JWT — enforced server-side + by route guard). */
@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/admin`;

  // ── Dashboard ─────────────────────────────────────────────────────────────
  getDashboard(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.base}/dashboard`);
  }

  // ── Subjects ──────────────────────────────────────────────────────────────
  listSubjects(query: PaginationQuery): Observable<PagedResult<Subject>> {
    return this.http.get<PagedResult<Subject>>(`${this.base}/subjects`, {
      params: pageParams(query),
    });
  }

  createSubject(body: CreateSubjectRequest): Observable<Subject> {
    return this.http.post<Subject>(`${this.base}/subjects`, body);
  }

  updateSubject(id: string, body: UpdateSubjectRequest): Observable<void> {
    return this.http.put<void>(`${this.base}/subjects/${id}`, body);
  }

  deleteSubject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/subjects/${id}`);
  }

  reorderSubjects(orderedIds: string[]): Observable<void> {
    return this.http.post<void>(`${this.base}/subjects/reorder`, { orderedIds });
  }

  // ── Coaching ──────────────────────────────────────────────────────────────
  listCoaching(query: PaginationQuery): Observable<PagedResult<CoachingProgram>> {
    return this.http.get<PagedResult<CoachingProgram>>(`${this.base}/coaching-programs`, {
      params: pageParams(query),
    });
  }

  createCoaching(body: CreateCoachingProgramRequest): Observable<CoachingProgram> {
    return this.http.post<CoachingProgram>(`${this.base}/coaching-programs`, body);
  }

  updateCoaching(id: string, body: UpdateCoachingProgramRequest): Observable<void> {
    return this.http.put<void>(`${this.base}/coaching-programs/${id}`, body);
  }

  deleteCoaching(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/coaching-programs/${id}`);
  }

  // ── Tests + question builder ────────────────────────────────────────────────
  listTests(
    query: PaginationQuery & { subjectId?: string; status?: AssessmentStatus },
  ): Observable<PagedResult<AssessmentListItem>> {
    let params = pageParams(query);
    if (query.subjectId) {
      params = params.set('subjectId', query.subjectId);
    }
    if (query.status !== undefined && query.status !== null) {
      params = params.set('status', String(query.status));
    }
    return this.http.get<PagedResult<AssessmentListItem>>(`${this.base}/tests`, { params });
  }

  getTest(id: string): Observable<AssessmentAdminDetail> {
    return this.http.get<AssessmentAdminDetail>(`${this.base}/tests/${id}`);
  }

  createTest(body: CreateTestRequest): Observable<AssessmentAdminDetail> {
    return this.http.post<AssessmentAdminDetail>(`${this.base}/tests`, body);
  }

  updateTest(id: string, body: UpdateTestMetadataRequest): Observable<void> {
    return this.http.put<void>(`${this.base}/tests/${id}`, body);
  }

  deleteTest(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/tests/${id}`);
  }

  publishTest(id: string): Observable<void> {
    return this.http.post<void>(`${this.base}/tests/${id}/publish`, {});
  }

  unpublishTest(id: string): Observable<void> {
    return this.http.post<void>(`${this.base}/tests/${id}/unpublish`, {});
  }

  archiveTest(id: string): Observable<void> {
    return this.http.post<void>(`${this.base}/tests/${id}/archive`, {});
  }

  addMcQuestion(testId: string, body: AddMcQuestionRequest): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(
      `${this.base}/tests/${testId}/questions/multiple-choice`,
      body,
    );
  }

  removeQuestion(testId: string, questionId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/tests/${testId}/questions/${questionId}`);
  }

  reorderQuestions(testId: string, orderedQuestionIds: string[]): Observable<void> {
    return this.http.post<void>(`${this.base}/tests/${testId}/questions/reorder`, {
      orderedQuestionIds,
    });
  }

  // ── Leads ─────────────────────────────────────────────────────────────────
  listLeads(
    query: PaginationQuery & { status?: LeadStatus },
  ): Observable<PagedResult<LeadListItem>> {
    let params = pageParams(query);
    if (query.status !== undefined && query.status !== null) {
      params = params.set('status', String(query.status));
    }
    return this.http.get<PagedResult<LeadListItem>>(`${this.base}/leads`, { params });
  }

  getLead(id: string): Observable<Lead> {
    return this.http.get<Lead>(`${this.base}/leads/${id}`);
  }

  setLeadStatus(id: string, status: LeadStatus): Observable<void> {
    return this.http.put<void>(`${this.base}/leads/${id}/status`, { status });
  }

  setLeadNotes(id: string, notes: string | null): Observable<void> {
    return this.http.put<void>(`${this.base}/leads/${id}/notes`, { notes });
  }

  // ── Testimonials ────────────────────────────────────────────────────────────
  listTestimonials(): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(`${this.base}/testimonials`);
  }

  createTestimonial(body: CreateTestimonialRequest): Observable<Testimonial> {
    return this.http.post<Testimonial>(`${this.base}/testimonials`, body);
  }

  updateTestimonial(id: string, body: UpdateTestimonialRequest): Observable<void> {
    return this.http.put<void>(`${this.base}/testimonials/${id}`, body);
  }

  deleteTestimonial(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/testimonials/${id}`);
  }

  // ── Team ─────────────────────────────────────────────────────────────────
  listTeam(): Observable<TeamMember[]> {
    return this.http.get<TeamMember[]>(`${this.base}/team`);
  }

  createTeamMember(body: CreateTeamMemberRequest): Observable<TeamMember> {
    return this.http.post<TeamMember>(`${this.base}/team`, body);
  }

  updateTeamMember(id: string, body: UpdateTeamMemberRequest): Observable<void> {
    return this.http.put<void>(`${this.base}/team/${id}`, body);
  }

  deleteTeamMember(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/team/${id}`);
  }

  // ── FAQ ──────────────────────────────────────────────────────────────────
  listFaq(): Observable<FaqItem[]> {
    return this.http.get<FaqItem[]>(`${this.base}/faq`);
  }

  createFaqItem(body: CreateFaqItemRequest): Observable<FaqItem> {
    return this.http.post<FaqItem>(`${this.base}/faq`, body);
  }

  updateFaqItem(id: string, body: UpdateFaqItemRequest): Observable<void> {
    return this.http.put<void>(`${this.base}/faq/${id}`, body);
  }

  deleteFaqItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/faq/${id}`);
  }

  reorderFaqItems(orderedIds: string[]): Observable<void> {
    return this.http.post<void>(`${this.base}/faq/reorder`, { orderedIds });
  }

  // ── Pricing ────────────────────────────────────────────────────────────────
  listPricing(): Observable<PricingTier[]> {
    return this.http.get<PricingTier[]>(`${this.base}/pricing`);
  }

  createPricingTier(body: CreatePricingTierRequest): Observable<PricingTier> {
    return this.http.post<PricingTier>(`${this.base}/pricing`, body);
  }

  updatePricingTier(id: string, body: UpdatePricingTierRequest): Observable<void> {
    return this.http.put<void>(`${this.base}/pricing/${id}`, body);
  }

  deletePricingTier(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/pricing/${id}`);
  }

  reorderPricingTiers(orderedIds: string[]): Observable<void> {
    return this.http.post<void>(`${this.base}/pricing/reorder`, { orderedIds });
  }

  // ── Site settings ───────────────────────────────────────────────────────────
  getSiteSettings(): Observable<SiteSettings> {
    return this.http.get<SiteSettings>(`${this.base}/site-settings`);
  }

  updateSiteSettings(settings: SiteSettings): Observable<void> {
    return this.http.put<void>(`${this.base}/site-settings`, { settings });
  }

  // ── Upload ────────────────────────────────────────────────────────────────
  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${this.base}/upload/image`, formData);
  }

  // ── Users ─────────────────────────────────────────────────────────────────
  listUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.base}/users`);
  }

  createUser(body: CreateUserRequest): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.base}/users`, body);
  }

  updateUserRole(userId: string, role: string): Observable<void> {
    return this.http.put<void>(`${this.base}/users/${userId}/role`, { role });
  }

  deactivateUser(userId: string): Observable<void> {
    return this.http.post<void>(`${this.base}/users/${userId}/deactivate`, {});
  }

  reactivateUser(userId: string): Observable<void> {
    return this.http.post<void>(`${this.base}/users/${userId}/reactivate`, {});
  }
}

function pageParams(query: PaginationQuery): HttpParams {
  let params = new HttpParams()
    .set('page', String(query.page ?? 1))
    .set('pageSize', String(query.pageSize ?? 20));
  if (query.search) {
    params = params.set('search', query.search);
  }
  return params;
}
