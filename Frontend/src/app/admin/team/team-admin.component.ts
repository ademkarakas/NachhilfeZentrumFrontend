import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AdminApiService } from '../../core/api/admin-api.service';
import { TeamMember } from '../../core/models/api.models';
import { STAFF_KIND_LABELS, StaffKind } from '../../core/models/enums';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmService } from '../shared/confirm-dialog.component';
import { TeamFormDialogComponent, TeamFormResult } from './team-form-dialog.component';

@Component({
  selector: 'app-team-admin',
  imports: [MatTableModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './team-admin.component.html',
  styleUrl: './team-admin.component.scss',
})
export class TeamAdminComponent implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly dialog = inject(MatDialog);
  private readonly confirm = inject(ConfirmService);
  private readonly toast = inject(ToastService);

  readonly items = signal<TeamMember[]>([]);
  readonly columns = ['name', 'kind', 'published', 'actions'];

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.api.listTeam().subscribe((t) => this.items.set(t));
  }

  create(): void {
    this.dialog
      .open(TeamFormDialogComponent, { data: null })
      .afterClosed()
      .subscribe((result?: TeamFormResult) => {
        if (!result) {
          return;
        }
        this.api
          .createTeamMember({ ...result, displayOrder: this.items().length })
          .subscribe(() => {
            this.toast.success('Teammitglied erstellt.');
            this.load();
          });
      });
  }

  edit(member: TeamMember): void {
    this.dialog
      .open(TeamFormDialogComponent, { data: member })
      .afterClosed()
      .subscribe((result?: TeamFormResult) => {
        if (!result) {
          return;
        }
        this.api.updateTeamMember(member.id, result).subscribe(() => {
          this.toast.success('Teammitglied aktualisiert.');
          this.load();
        });
      });
  }

  remove(member: TeamMember): void {
    this.confirm
      .ask({
        title: 'Teammitglied löschen?',
        message: `„${member.fullName}“ wird ausgeblendet.`,
        confirmText: 'Löschen',
        danger: true,
      })
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
        this.api.deleteTeamMember(member.id).subscribe(() => {
          this.toast.success('Teammitglied gelöscht.');
          this.load();
        });
      });
  }

  kindLabel(k: StaffKind): string {
    return STAFF_KIND_LABELS[k];
  }
}
