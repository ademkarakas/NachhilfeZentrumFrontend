import { ContentBlock } from '../core/models/api.models';
import { IconName } from './ui/icon.component';

/** Shape used by the marketing pages for icon + title + text cards/steps. */
export interface CardBlock {
  icon: IconName;
  title: string;
  text: string;
}

/**
 * Map admin-managed content blocks of a given section to the card/step shape used across the
 * public marketing pages. Pages call this and fall back to their built-in default copy when the
 * section returns nothing (empty DB or failed request) — so the layout never breaks.
 */
export function cardsFromBlocks(blocks: ContentBlock[], sectionKey: string): CardBlock[] {
  return blocks
    .filter((b) => b.sectionKey === sectionKey)
    .map((b) => ({ icon: (b.iconKey || 'sparkles') as IconName, title: b.title, text: b.body ?? '' }));
}
