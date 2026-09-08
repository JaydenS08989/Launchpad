#!/usr/bin/env node
import { copyFile, mkdir, readFile, stat } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const source = process.argv[2] && resolve(process.argv[2]);
if (!source) {
  console.error('Usage: node scripts/import-tripo-assets.mjs <Tripo export directory>');
  process.exit(2);
}

const manifest = JSON.parse(await readFile(join(root, 'data/tripo-assets.json'), 'utf8'));
const output = join(root, 'assets/tripo');
await mkdir(output, { recursive: true });

const failures = [];
for (const asset of manifest.assets) {
  const input = join(source, basename(asset.file));
  try {
    const info = await stat(input);
    if (info.size < 1024) throw new Error('file is unexpectedly small');
    await copyFile(input, join(root, asset.file));
    console.log(`Imported ${asset.id}: ${asset.file}`);
  } catch (error) {
    if (asset.required) failures.push(`${asset.id} (${error.message})`);
  }
}

if (failures.length) {
  console.error(`Missing required Tripo exports:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(`Imported ${manifest.assets.length} GLB assets. Embedded PBR textures must be ${manifest.textureResolution}×${manifest.textureResolution}.`);
