import { fileURLToPath } from 'node:url';
import { check, prepare, publish, publishPrep } from './episode-workflow.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const help = `Usage: npm run episode -- <command> [options]
  prepare --slug <slug> --topic <map-id> --number <n> [--season 1]
  publish-prep --slug <slug>
  check --slug <slug> [--date YYYY-MM-DD]
  publish --slug <slug> --date YYYY-MM-DD --reviewed

Drafts: production/episodes/<slug>/. Private recording sources: .private/.
Publication changes local JSON; git push deploys the reviewed site.`;
try {
  const [command, ...args] = process.argv.slice(2);
  if (!command || command === '--help' || command === 'help') { console.log(help); }
  else {
    const allowed = { prepare: ['slug', 'topic', 'number', 'season'], 'publish-prep': ['slug'], check: ['slug', 'date'], publish: ['slug', 'date', 'reviewed'] };
    if (!allowed[command]) throw new Error(`Unknown command: ${command}\n${help}`);
    const options = {};
    while (args.length) {
      const flag = args.shift(); const key = flag?.slice(2);
      if (!flag?.startsWith('--') || !allowed[command].includes(key) || key in options) throw new Error(`Unknown or repeated option: ${flag}`);
      if (key === 'reviewed') options[key] = true;
      else { const value = args.shift(); if (!value || value.startsWith('--')) throw new Error(`Missing value for ${flag}`); options[key] = ['number', 'season'].includes(key) ? Number(value) : value; }
    }
    console.log(await ({ prepare, 'publish-prep': publishPrep, check, publish })[command](root, options));
  }
} catch (error) { console.error(error.message); process.exitCode = 1; }
