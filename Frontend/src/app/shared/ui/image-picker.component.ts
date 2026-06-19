import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AdminApiService } from '../../core/api/admin-api.service';

@Component({
  selector: 'app-image-picker',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    MatProgressBarModule,
  ],
  templateUrl: './image-picker.component.html',
  styleUrl: './image-picker.component.scss',
})
export class ImagePickerComponent {
  private readonly api = inject(AdminApiService);

  @Input() set value(v: string) {
    if (v && !this.uploading()) {
      this.urlValue.set(v);
      this.preview.set(v);
    }
  }
  @Output() valueChange = new EventEmitter<string>();

  readonly uploading = signal(false);
  readonly uploadError = signal('');
  readonly preview = signal('');
  readonly urlValue = signal('');

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadError.set('');
    this.uploading.set(true);

    this.api.uploadImage(file).subscribe({
      next: (res) => {
        this.uploading.set(false);
        this.preview.set(res.url);
        this.urlValue.set(res.url);
        this.valueChange.emit(res.url);
      },
      error: (err) => {
        this.uploading.set(false);
        this.uploadError.set(err?.error?.error || 'Upload fehlgeschlagen.');
      },
    });

    // Reset input so same file can be re-selected
    input.value = '';
  }

  clearUpload(): void {
    this.preview.set('');
    this.urlValue.set('');
    this.valueChange.emit('');
  }

  onUrlChange(url: string): void {
    this.urlValue.set(url);
    this.preview.set(url);
    this.valueChange.emit(url);
  }

  onImgError(): void {
    // Silently ignore broken URL preview
  }
}
