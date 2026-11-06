import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { validateContent } from './content-validation.mjs';
test('the public registry, recordings, review hashes, map and bilingual prep satisfy the publication contract', async () => {
  await validateContent(fileURLToPath(new URL('../', import.meta.url)));
});
