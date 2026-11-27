// TataKas hand-in program (Node 22, standard library only).
//
// The site itself is the static folder app/ beside this file: plain HTML, CSS
// and ES modules that a browser opens at app/index.html with no build step and
// no network request. This program is only the courier. It copies app/ and
// screenshots/ into the output directory and writes dossier.json there with
// buildDossier from vendor/makefun-frontend.ts, the kit's library, which must
// stay byte-identical to the kit copy because the scorer rebuilds the dossier
// with its own copy and compares the two.
//
// Run it locally the way the grader does, with MAKEFUN_OUTPUT_DIR standing in
// for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The gate's own caps, passed to buildDossier so an oversized hand-in fails
// here, in my hands, instead of at the scorer: at most 4 screenshots of
// 256 KiB each, at most 993 files and directories in app/, 16 MiB of app
// files in all, and a dossier text capped at 160 KiB.
const DOSSIER_LIMITS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

function copyFolder(name: string): void {
  const from = join(repoRoot, name);
  if (!existsSync(from)) throw new Error(`missing folder: ${name}`);
  cpSync(from, join(outputDir, name), { recursive: true });
}

mkdirSync(outputDir, { recursive: true });
copyFolder('app');
copyFolder('screenshots');

const shotNames = readdirSync(join(outputDir, 'screenshots')).filter((name) => !name.startsWith('.'));
if (shotNames.length < 3 || shotNames.length > 4) {
  throw new Error(`screenshots/ must hold 3 or 4 images, found ${shotNames.length}`);
}

writeFileSync(join(outputDir, 'dossier.json'), buildDossier(outputDir, DOSSIER_LIMITS));
console.log(`handed in: app/ + ${shotNames.length} screenshots + dossier.json -> ${outputDir}`);
