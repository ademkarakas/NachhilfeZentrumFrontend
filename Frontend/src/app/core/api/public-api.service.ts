import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AssessmentListItem,
  AttemptResult,
  CoachingProgram,
  CoachingProgramSummary,
  CreateLeadRequest,
  FaqItem,
  PricingTier,
  PublicAssessment,
  SiteSettings,
  Subject,
  SubjectSummary,
  SubmitAttemptRequest,
  TeamMember,
  Testimonial,
} from '../models/api.models';

/** Anonymous, public-facing API consumed by the marketing site + test-taking flow. */
@Injectable({ providedIn: 'root' })
export class PublicApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  getSubjects(): Observable<SubjectSummary[]> {
    return this.http.get<SubjectSummary[]>(`${this.base}/subjects`);
  }

  getSubject(slug: string): Observable<Subject> {
    return this.http.get<Subject>(`${this.base}/subjects/${slug}`);
  }

  getCoachingPrograms(): Observable<CoachingProgramSummary[]> {
    return this.http.get<CoachingProgramSummary[]>(`${this.base}/coaching-programs`);
  }

  getCoachingProgram(slug: string): Observable<CoachingProgram> {
    return this.http.get<CoachingProgram>(`${this.base}/coaching-programs/${slug}`);
  }

  getTestCatalog(): Observable<AssessmentListItem[]> {
    return this.http.get<AssessmentListItem[]>(`${this.base}/tests`);
  }

  getTestsBySubject(subjectId: string): Observable<AssessmentListItem[]> {
    return this.http.get<AssessmentListItem[]>(`${this.base}/subjects/${subjectId}/tests`);
  }

  getTest(slug: string): Observable<PublicAssessment> {
    return this.http.get<PublicAssessment>(`${this.base}/tests/${slug}`);
  }

  submitAttempt(assessmentId: string, body: SubmitAttemptRequest): Observable<AttemptResult> {
    return this.http.post<AttemptResult>(`${this.base}/tests/${assessmentId}/attempts`, body);
  }

  getAttemptResult(attemptId: string): Observable<AttemptResult> {
    return this.http.get<AttemptResult>(`${this.base}/attempts/${attemptId}`);
  }

  getTestimonials(): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(`${this.base}/testimonials`);
  }

  getTeam(): Observable<TeamMember[]> {
    return this.http.get<TeamMember[]>(`${this.base}/team`);
  }

  getSiteSettings(): Observable<SiteSettings> {
    return this.http.get<SiteSettings>(`${this.base}/site-settings`);
  }

  getFaq(): Observable<FaqItem[]> {
    return this.http.get<FaqItem[]>(`${this.base}/faq`);
  }

  getPricing(): Observable<PricingTier[]> {
    return this.http.get<PricingTier[]>(`${this.base}/pricing`);
  }

  createLead(body: CreateLeadRequest): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${this.base}/leads`, body);
  }
}
