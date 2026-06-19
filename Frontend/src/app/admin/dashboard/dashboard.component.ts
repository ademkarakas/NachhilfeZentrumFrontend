import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { AdminApiService } from '../../core/api/admin-api.service';
import { DashboardStats } from '../../core/models/api.models';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly api = inject(AdminApiService);
  readonly stats = signal<DashboardStats | null>(null);

  ngOnInit(): void {
    this.api.getDashboard().subscribe((s) => this.stats.set(s));
  }
}
