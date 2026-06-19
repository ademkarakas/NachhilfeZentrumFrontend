import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { AdminApiService } from '../../core/api/admin-api.service';
import { UserDto } from '../../core/models/api.models';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmService } from '../shared/confirm-dialog.component';
import { CreateUserDialogComponent } from './create-user-dialog.component';

@Component({
  selector: 'app-users-admin',
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, MatSelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './users-admin.component.html',
  styleUrl: './users-admin.component.scss',
})
export class UsersAdminComponent implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly dialog = inject(MatDialog);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmService);

  readonly users = signal<UserDto[]>([]);
  readonly columns = ['fullName', 'email', 'roles', 'status', 'actions'];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.api.listUsers().subscribe((u) => this.users.set(u));
  }

  openCreate(): void {
    const ref = this.dialog.open(CreateUserDialogComponent, { width: '440px' });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      this.api.createUser(result).subscribe({
        next: () => {
          this.toast.success('Benutzer erstellt.');
          this.load();
        },
        error: (err) => this.toast.error(err?.error?.detail || 'Fehler beim Erstellen.'),
      });
    });
  }

  getBackOfficeRole(user: UserDto): string {
    return user.roles.find((r) => r === 'Admin' || r === 'Editor') || 'Editor';
  }

  changeRole(user: UserDto, newRole: string): void {
    this.api.updateUserRole(user.id, newRole).subscribe({
      next: () => {
        this.toast.success('Rolle aktualisiert.');
        this.load();
      },
      error: () => this.toast.error('Fehler beim Ändern der Rolle.'),
    });
  }

  deactivate(user: UserDto): void {
    this.confirm
      .ask({
        title: 'Benutzer deaktivieren',
        message: `Benutzer "${user.fullName}" wirklich deaktivieren?`,
      })
      .subscribe((yes: boolean) => {
        if (!yes) return;
        this.api.deactivateUser(user.id).subscribe({
          next: () => {
            this.toast.success('Benutzer deaktiviert.');
            this.load();
          },
          error: () => this.toast.error('Fehler beim Deaktivieren.'),
        });
      });
  }

  reactivate(user: UserDto): void {
    this.api.reactivateUser(user.id).subscribe({
      next: () => {
        this.toast.success('Benutzer reaktiviert.');
        this.load();
      },
      error: () => this.toast.error('Fehler beim Reaktivieren.'),
    });
  }
}
