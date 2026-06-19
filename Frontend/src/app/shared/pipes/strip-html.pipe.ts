import { Pipe, PipeTransform } from '@angular/core';

/**
 * Renders rich-text (HTML) fields as a plain-text excerpt — used in admin list/table cells
 * where showing raw markup would be noise. Public pages render the HTML itself via [innerHTML].
 */
@Pipe({ name: 'stripHtml' })
export class StripHtmlPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }
    return value
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
