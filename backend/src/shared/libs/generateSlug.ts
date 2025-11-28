import slugify from 'slugify';
import { transliterate } from 'transliteration';

export function generateSlug(title: string) {
  const latin = transliterate(title);
  return slugify(latin, { lower: true, strict: true });
}
