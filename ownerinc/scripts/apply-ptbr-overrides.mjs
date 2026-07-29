#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';

const poPath =
  process.argv[2] ?? 'packages/twenty-front/src/locales/pt-BR.po';
const overridesPath =
  process.argv[3] ?? 'ownerinc/i18n/pt-BR-overrides.json';

const [poSource, overridesSource] = await Promise.all([
  readFile(poPath, 'utf8'),
  readFile(overridesPath, 'utf8'),
]);

const overrides = JSON.parse(overridesSource);
const blocks = poSource.split(/\n{2,}/);
const seen = new Set();

const decodePoField = (block, fieldName) => {
  const lines = block.split('\n');
  const fieldIndex = lines.findIndex((line) =>
    line.startsWith(`${fieldName} `),
  );

  if (fieldIndex === -1) {
    return null;
  }

  const encodedParts = [lines[fieldIndex].slice(fieldName.length + 1)];

  for (let index = fieldIndex + 1; index < lines.length; index += 1) {
    if (!lines[index].startsWith('"')) {
      break;
    }
    encodedParts.push(lines[index]);
  }

  return encodedParts.map((part) => JSON.parse(part)).join('');
};

const encodePoValue = (value) => JSON.stringify(value);

const updatedBlocks = blocks.map((block) => {
  const messageId = decodePoField(block, 'msgid');

  if (messageId === null || !(messageId in overrides)) {
    return block;
  }

  seen.add(messageId);

  const lines = block.split('\n');
  const messageStringIndex = lines.findIndex((line) =>
    line.startsWith('msgstr '),
  );

  if (messageStringIndex === -1) {
    throw new Error(`Entrada sem msgstr: ${messageId}`);
  }

  let nextIndex = messageStringIndex + 1;
  while (nextIndex < lines.length && lines[nextIndex].startsWith('"')) {
    nextIndex += 1;
  }

  lines.splice(
    messageStringIndex,
    nextIndex - messageStringIndex,
    `msgstr ${encodePoValue(overrides[messageId])}`,
  );

  return lines.join('\n');
});

const missing = Object.keys(overrides).filter((messageId) => !seen.has(messageId));

if (missing.length > 0) {
  throw new Error(
    `Overrides ausentes no catálogo pt-BR:\n${missing
      .map((messageId) => `- ${messageId}`)
      .join('\n')}`,
  );
}

await writeFile(poPath, `${updatedBlocks.join('\n\n').trimEnd()}\n`);

console.log(
  `Ownerinc pt-BR: ${seen.size} traduções aplicadas em ${poPath}.`,
);
