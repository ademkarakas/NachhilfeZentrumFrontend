import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicApiService } from '../../core/api/public-api.service';
import { AssessmentListItem, SubjectSummary } from '../../core/models/api.models';
import { AssessmentDifficulty, DIFFICULTY_LABELS, VisibilityLevel } from '../../core/models/enums';
import { SeoService } from '../../core/seo/seo.service';
import { CountUpDirective } from '../../shared/count-up.directive';
import { RevealDirective } from '../../shared/reveal.directive';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { CardComponent } from '../../shared/ui/card.component';
import { CtaSectionComponent } from '../../shared/ui/cta-section.component';
import { IconComponent, IconName } from '../../shared/ui/icon.component';
import { LockIndicatorComponent } from '../../shared/ui/lock-indicator.component';
import { SpinnerComponent } from '../../shared/ui/spinner.component';

@Component({
  selector: 'app-test-catalog',
  imports: [
    RouterLink,
    CardComponent,
    BadgeComponent,
    LockIndicatorComponent,
    SpinnerComponent,
    RevealDirective,
    IconComponent,
    ButtonComponent,
    CtaSectionComponent,
    CountUpDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './test-catalog.component.html',
  styleUrl: './test-catalog.component.scss',
})
export class TestCatalogComponent implements OnInit {
  private readonly api = inject(PublicApiService);
  private readonly seo = inject(SeoService);

  readonly tests = signal<AssessmentListItem[]>([]);
  readonly subjects = signal<SubjectSummary[]>([]);
  readonly subjectFilter = signal('');
  readonly loading = signal(true);
  protected readonly Visibility = VisibilityLevel;

  readonly filtered = computed(() => {
    const id = this.subjectFilter();
    return id ? this.tests().filter((t) => t.subjectId === id) : this.tests();
  });

  readonly usps: { icon: IconName; title: string; text: string }[] = [
    {
      icon: 'badge-check',
      title: 'Wissen prüfen',
      text: 'Finde heraus, wo du stehst — objektiv und ohne Druck.',
    },
    {
      icon: 'sparkles',
      title: 'Qualität erleben',
      text: 'Unsere Tests spiegeln unsere Unterrichtsmethodik wider.',
    },
    {
      icon: 'target',
      title: 'Fortschritt messen',
      text: 'Wiederhole Tests und sieh, wie sich dein Wissen entwickelt.',
    },
  ];

  readonly steps: { icon: IconName; title: string; text: string }[] = [
    {
      icon: 'book-open',
      title: 'Fach wählen',
      text: 'Wähle aus verschiedenen Schulfächern den passenden Bereich.',
    },
    {
      icon: 'arrow-right',
      title: 'Test starten',
      text: 'Ohne Anmeldung — direkt loslegen und dein Wissen testen.',
    },
    {
      icon: 'shield-check',
      title: 'Ergebnis erhalten',
      text: 'Sofortige Auswertung mit Punktzahl und Feedback.',
    },
  ];

  readonly stats = [
    { value: 120, suffix: '+', label: 'Tests verfügbar' },
    { value: 1500, suffix: '+', label: 'Fragen' },
    { value: 8, suffix: '', label: 'Fächer' },
    { value: 3200, suffix: '+', label: 'Tests absolviert' },
  ];

  readonly faq = [
    {
      question: 'Muss ich mich anmelden?',
      answer:
        'Nein, alle Tests sind kostenlos und ohne Registrierung zugänglich. Für gespeicherte Ergebnisse und Fortschrittsverfolgung kannst du optional ein Konto erstellen.',
    },
    {
      question: 'Wie lange dauert ein Test?',
      answer:
        'Je nach Fach und Umfang zwischen 5 und 20 Minuten. Die geschätzte Dauer wird bei jedem Test angezeigt.',
    },
    {
      question: 'Kann ich Tests wiederholen?',
      answer:
        'Ja, beliebig oft. So kannst du deinen Fortschritt über die Zeit verfolgen und gezielt üben.',
    },
    {
      question: 'Was passiert mit meinen Ergebnissen?',
      answer:
        'Ohne Anmeldung werden keine Daten gespeichert. Mit Konto siehst du deinen Verlauf und kannst Schwächen gezielt angehen.',
    },
    {
      question: 'Sind die Tests wirklich kostenlos?',
      answer:
        'Ja — unsere öffentlichen Tests sind dauerhaft kostenlos. Sie zeigen unsere Unterrichtsqualität und helfen dir, deinen Stand einzuschätzen.',
    },
  ];

  ngOnInit(): void {
    this.seo.update({
      title: 'Tests & Übungen',
      description: 'Kostenlose fachbezogene Übungstests — ohne Anmeldung ausprobieren.',
      path: '/tests',
    });
    this.api.getTestCatalog().subscribe({
      next: (t) => {
        this.tests.set(t);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
    this.api.getSubjects().subscribe((s) => this.subjects.set(s));
  }

  onSubject(event: Event): void {
    this.subjectFilter.set((event.target as HTMLSelectElement).value);
  }

  difficultyLabel(d: AssessmentDifficulty): string {
    return DIFFICULTY_LABELS[d];
  }
}
