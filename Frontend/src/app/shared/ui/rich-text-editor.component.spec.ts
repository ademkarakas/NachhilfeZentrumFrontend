import { TestBed } from '@angular/core/testing';
import { RichTextEditorComponent } from './rich-text-editor.component';

/**
 * Unit-tests the ControlValueAccessor wiring directly (no Quill rendering) by instantiating
 * the component inside an injection context — enough to exercise writeValue / onChange /
 * setDisabledState and the plain-text counter without a browser editor.
 */
describe('RichTextEditorComponent (CVA)', () => {
  function create(): RichTextEditorComponent {
    return TestBed.runInInjectionContext(() => new RichTextEditorComponent());
  }

  it('writeValue sets the value', () => {
    const c = create();
    c.writeValue('<p>Hi</p>');
    expect(c.value()).toBe('<p>Hi</p>');
  });

  it('emits onChange only for user edits and tracks visible-text length', () => {
    const c = create();
    const changes: string[] = [];
    c.registerOnChange((v) => changes.push(v));

    // Programmatic update (source 'api') updates the counter but must not emit.
    c.onContentChanged({ html: '<p>api</p>', text: 'api\n', source: 'api' } as never);
    expect(changes).toEqual([]);
    expect(c.textLength()).toBe(3);

    // User edit emits the html and updates value.
    c.onContentChanged({ html: '<p>typed</p>', text: 'typed\n', source: 'user' } as never);
    expect(changes).toEqual(['<p>typed</p>']);
    expect(c.value()).toBe('<p>typed</p>');
    expect(c.textLength()).toBe(5);
  });

  it('setDisabledState toggles disabled', () => {
    const c = create();
    c.setDisabledState(true);
    expect(c.disabled()).toBe(true);
  });
});
