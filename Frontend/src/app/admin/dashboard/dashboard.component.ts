import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { AdminApiService } from '../../core/api/admin-api.service';
import { DashboardStats } from '../../core/models/api.models';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <h1>Dashboard</h1>
    </header>

    @if (stats(); as s) {
      <div class="stats">
        <mat-card appearance="outlined">
          <mat-card-content>
            <span class="stat__value">{{ s.newLeads }}</span>
            <span class="stat__label">Neue Anfragen</span>
            <a routerLink="/admin/anfragen">Ansehen →</a>
          </mat-card-content>
        </mat-card>
        <mat-card appearance="outlined">
          <mat-card-content>
            <span class="stat__value">{{ s.publishedTests }}</span>
            <span class="stat__label">Veröffentlichte Tests</span>
            <a routerLink="/admin/tests">Verwalten →</a>
          </mat-card-content>
        </mat-card>
        <mat-card appearance="outlined">
          <mat-card-content>
            <span class="stat__value">{{ s.attemptsLast7Days }}</span>
            <span class="stat__label">Testdurchläufe (7 Tage)</span>
          </mat-card-content>
        </mat-card>
        <mat-card appearance="outlined">
          <mat-card-content>
            <span class="stat__value">{{ s.attemptsLast30Days }}</span>
            <span class="stat__label">Testdurchläufe (30 Tage)</span>
          </mat-card-content>
        </mat-card>
      </div>
    }
  `,
  styles: [
    `
      .page-head h1 {
        margin-bottom: 1.5rem;
      }
      .stats {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      }
      mat-card-content {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding-top: 0.5rem;
      }
      .stat__value {
        font-size: 2.5rem;
        font-weight: 800;
        color: var(--color-primary-dark);
        line-height: 1;
      }
      .stat__label {
        color: var(--color-muted);
        font-weight: 600;
      }
      a {
        margin-top: 0.5rem;
        font-weight: 600;
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  private readonly api = inject(AdminApiService);
  readonly stats = signal<DashboardStats | null>(null);

  ngOnInit(): void {
    this.api.getDashboard().subscribe((s) => this.stats.set(s));
  }
}
