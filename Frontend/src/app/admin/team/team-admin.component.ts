import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AdminApiService } from '../../core/api/admin-api.service';
import { TeamMember } from '../../core/models/api.models';
import { STAFF_KIND_LABELS, StaffKind } from '../../core/models/enums';
import { ToastService } from '../../core/services/toast.service';
import { RichTextEditorComponent } from '../../shared/ui/rich-text-editor.component';
import { ConfirmService } from '../shared/confirm-dialog.component';

interface TeamFormResult {
  fullName: string;
  kind: StaffKind;
  title: string | null;
  bio: string;
  photoUrl: string | null;
  credentials: string | null;
  subjectsTaught: string | null;
  isPublished: boolean;
}

@Component({
  selector: 'app-team-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    RichTextEditorComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>{{ data ? 'Teammitglied bearbeiten' : 'Neues Teammitglied' }}</h2>
    <form [formGroup]="form" (ngSubmit)="save()">
      <mat-dialog-content class="form">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="fullName" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Art</mat-label>
          <mat-select formControlName="kind">
            <mat-option [value]="Kind.Tutor">{{ kindLabel(Kind.Tutor) }}</mat-option>
            <mat-option [value]="Kind.Coach">{{ kindLabel(Kind.Coach) }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Titel (optional)</mat-label>
          <input matInput formControlName="title" />
        </mat-form-field>
        <div class="rte-field">
          <label class="rte-field__label">Kurzbio</label>
          <app-rich-text-editor formControlName="bio" [maxLength]="4000" />
        </div>
        <mat-form-field appearance="outline">
          <mat-label>Foto-URL (optional)</mat-label>
          <input matInput formControlName="photoUrl" />
        </mat-form-field>
        <div class="rte-field">
          <label class="rte-field__label">Qualifikationen (optional)</label>
          <app-rich-text-editor
            formControlName="credentials"
            [maxLength]="2000"
            minHeight="5rem"
            placeholder="z. B. Studium, Zertifikate, Erfahrung"
          />
        </div>
        <mat-form-field appearance="outline">
          <mat-label>Unterrichtete Fächer (optional)</mat-label>
          <input matInput formControlName="subjectsTaught" placeholder="Mathe, Physik" />
        </mat-form-field>
        <mat-checkbox formControlName="isPublished">Veröffentlicht</mat-checkbox>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" [mat-dialog-close]="undefined">Abbrechen</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">
          Speichern
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`.form { display: flex; flex-direction: column; min-width: min(480px, 85vw); padding-top: 0.5rem; }`],
})
export class TeamFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  readonly data = inject<TeamMember | null>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<TeamFormDialogComponent, TeamFormResult>);
  protected readonly Kind = StaffKind;

  readonly form = this.fb.nonNullable.group({
    fullName: [this.data?.fullName ?? '', [Validators.required, Validators.maxLength(150)]],
    kind: [this.data?.kind ?? StaffKind.Tutor, [Validators.required]],
    title: [this.data?.title ?? ''],
    bio: [this.data?.bio ?? '', [Validators.maxLength(20000)]],
    // credentials carries sanitized HTML now — generous bound (markup inflates length).
    photoUrl: [this.data?.photoUrl ?? ''],
    credentials: [this.data?.credentials ?? ''],
    subjectsTaught: [this.data?.subjectsTaught ?? ''],
    isPublished: [this.data?.isPublished ?? true],
  });

  kindLabel(k: StaffKind): string {
    return STAFF_KIND_LABELS[k];
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }
    const v = this.form.getRawValue();
    this.ref.close({
      fullName: v.fullName,
      kind: v.kind,
      title: v.title || null,
      bio: v.bio,
      photoUrl: v.photoUrl || null,
      credentials: v.credentials || null,
      subjectsTaught: v.subjectsTaught || null,
      isPublished: v.isPublished,
    });
  }
}

@Component({
  selector: 'app-team-admin',
  imports: [MatTableModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <h1>Team</h1>
      <button mat-flat-button color="primary" (click)="create()">Neues Teammitglied</button>
    </header>

    @if (items().length === 0) {
      <p class="empty">Noch keine Teammitglieder angelegt.</p>
    } @else {
      <table mat-table [dataSource]="items()" class="table">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let m">{{ m.fullName }}</td>
        </ng-container>
        <ng-container matColumnDef="kind">
          <th mat-header-cell *matHeaderCellDef>Art</th>
          <td mat-cell *matCellDef="let m">{{ kindLabel(m.kind) }}</td>
        </ng-container>
        <ng-container matColumnDef="published">
          <th mat-header-cell *matHeaderCellDef>Sichtbar</th>
          <td mat-cell *matCellDef="let m">{{ m.isPublished ? 'Ja' : 'Nein' }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let m" class="actions">
            <button mat-button (click)="edit(m)">Bearbeiten</button>
            <button mat-button color="warn" (click)="remove(m)">Löschen</button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns"></tr>
      </table>
    }
  `,
  styles: [
    `
      .page-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1.5rem;
      }
      .table {
        width: 100%;
        background: var(--color-surface);
        border-radius: var(--radius);
      }
      .actions {
        text-align: right;
        white-space: nowrap;
      }
      .empty {
        color: var(--color-muted);
      }
    `,
  ],
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
        this.api.createTeamMember({ ...result, displayOrder: this.items().length }).subscribe(() => {
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
