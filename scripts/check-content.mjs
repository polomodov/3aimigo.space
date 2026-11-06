import { fileURLToPath } from 'node:url';
import { validateContent } from './content-validation.mjs';
const data = await validateContent(fileURLToPath(new URL('../', import.meta.url)));
console.log(`Verified ${data.episodes.length} published episodes, their topic map and bilingual prep briefs.`);
