import { StripHtmlPipe } from './strip-html.pipe';

describe('StripHtmlPipe', () => {
  const pipe = new StripHtmlPipe();

  it('removes tags and collapses whitespace', () => {
    expect(pipe.transform('<p>Hallo <strong>Welt</strong></p>')).toBe('Hallo Welt');
  });

  it('decodes common entities', () => {
    expect(pipe.transform('<p>Mathe &amp; Physik</p>')).toBe('Mathe & Physik');
  });

  it('returns empty string for null/undefined/empty', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform('<p><br></p>')).toBe('');
  });
});
