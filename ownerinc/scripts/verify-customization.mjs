#!/usr/bin/env node

import { access, readFile } from 'node:fs/promises';

const poPath = 'packages/twenty-front/src/locales/pt-BR.po';
const overridesPath = 'ownerinc/i18n/pt-BR-overrides.json';

const [poSource, overridesSource] = await Promise.all([
  readFile(poPath, 'utf8'),
  readFile(overridesPath, 'utf8'),
]);
const overrides = JSON.parse(overridesSource);

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

const entries = new Map();
const untranslated = [];

for (const block of poSource.split(/\n{2,}/)) {
  const messageId = decodePoField(block, 'msgid');
  const messageString = decodePoField(block, 'msgstr');

  if (messageId === null || messageId === '') {
    continue;
  }

  entries.set(messageId, messageString);

  if (messageString === '') {
    untranslated.push(messageId);
  }
}

const mismatches = Object.entries(overrides).filter(
  ([messageId, expected]) => entries.get(messageId) !== expected,
);

if (untranslated.length > 0) {
  throw new Error(
    `Catálogo pt-BR ainda tem ${untranslated.length} entradas vazias:\n${untranslated
      .map((messageId) => `- ${messageId}`)
      .join('\n')}`,
  );
}

if (mismatches.length > 0) {
  throw new Error(
    `Overrides pt-BR divergentes:\n${mismatches
      .map(
        ([messageId, expected]) =>
          `- ${messageId}: esperado ${JSON.stringify(expected)}, recebido ${JSON.stringify(entries.get(messageId))}`,
      )
      .join('\n')}`,
  );
}

for (const requiredAsset of [
  'packages/twenty-front/public/images/icons/android/android-launchericon-48-48.png',
  'packages/twenty-front/public/images/icons/android/android-launchericon-192-192.png',
  'packages/twenty-front/public/images/icons/ios/192.png',
  'packages/twenty-front/public/fonts/ownerinc/raleway-latin.woff2',
  'packages/twenty-front/public/fonts/ownerinc/raleway-latin-ext.woff2',
]) {
  await access(requiredAsset);
}

const indexHtml = await readFile('packages/twenty-front/index.html', 'utf8');
const manifest = JSON.parse(
  await readFile('packages/twenty-front/public/manifest.json', 'utf8'),
);
const lightTheme = await readFile(
  'packages/twenty-ui/src/theme-constants/theme-light.css',
  'utf8',
);
const darkTheme = await readFile(
  'packages/twenty-ui/src/theme-constants/theme-dark.css',
  'utf8',
);
const ownerincDockerfile = await readFile(
  'packages/twenty-docker/twenty/Dockerfile',
  'utf8',
);
const standardCommandMenuItems = await readFile(
  'packages/twenty-server/src/engine/workspace-manager/twenty-standard-application/constants/standard-command-menu-item.constant.ts',
  'utf8',
);
const standardNavigationMenuItems = await readFile(
  'packages/twenty-server/src/engine/workspace-manager/twenty-standard-application/constants/standard-navigation-menu-item.constant.ts',
  'utf8',
);
const mainNavigationDrawer = await readFile(
  'packages/twenty-front/src/modules/navigation/components/MainNavigationDrawer.tsx',
  'utf8',
);
const mobileNavigationBar = await readFile(
  'packages/twenty-front/src/modules/navigation/components/MobileNavigationBar.tsx',
  'utf8',
);
const chatwootLauncher = await readFile(
  'packages/twenty-front/src/modules/ownerinc/components/OwnerincChatwootLauncher.tsx',
  'utf8',
);
const chatwootConstants = await readFile(
  'packages/twenty-front/src/modules/ownerinc/constants/ownerincChatwoot.constants.ts',
  'utf8',
);
const chatwootIcon = await readFile(
  'packages/twenty-front/src/modules/ownerinc/components/OwnerincChatwootIcon.tsx',
  'utf8',
);
const frontPermissionHook = await readFile(
  'packages/twenty-front/src/modules/settings/roles/hooks/useHasPermissionFlag.ts',
  'utf8',
);
const serverPermissions = await readFile(
  'packages/twenty-server/src/engine/metadata-modules/permissions/permissions.service.ts',
  'utf8',
);

if (!indexHtml.includes('<title>Ownerinc CRM</title>')) {
  throw new Error('Título público Ownerinc CRM ausente.');
}

if (manifest.name !== 'Ownerinc CRM' || manifest.short_name !== 'Ownerinc') {
  throw new Error('Manifesto PWA não está identificado como Ownerinc CRM.');
}

if (
  !lightTheme.includes('--t-font-family: Raleway, sans-serif;') ||
  !darkTheme.includes('--t-font-family: Raleway, sans-serif;')
) {
  throw new Error('Raleway não está ativa nos dois temas.');
}

if (
  !standardCommandMenuItems.includes(
    "label: 'Criar ${capitalize(objectMetadataItem.labelSingular)}'",
  ) ||
  !standardCommandMenuItems.includes(
    "shortLabel: 'Criar ${capitalize(objectMetadataItem.labelSingular)}'",
  )
) {
  throw new Error('A ação global de criação não está em português.');
}

for (const commandLabel of [
  "label: 'Redigir e-mail'",
  "shortLabel: 'Redigir'",
  "label: 'Redigir campanha'",
  "shortLabel: 'Campanha'",
  "label: 'Criar campanha'",
  "shortLabel: 'Criar campanha'",
  "label: 'Enviar campanha'",
  "shortLabel: 'Enviar'",
  "label: 'Enviar e-mail de teste'",
  "shortLabel: 'Testar'",
]) {
  if (!standardCommandMenuItems.includes(commandLabel)) {
    throw new Error(
      `Rótulo persistido de campanha ausente: ${commandLabel}`,
    );
  }
}

if (!standardNavigationMenuItems.includes("name: 'Automações'")) {
  throw new Error('A pasta de automações não está em português.');
}

if (!mainNavigationDrawer.includes('<OwnerincChatwootLauncher />')) {
  throw new Error('Launcher do Chatwoot ausente da navegação principal.');
}

if (
  !ownerincDockerfile.includes(
    'COPY ./packages/twenty-docker/twenty/Dockerfile /app/packages/twenty-docker/twenty/Dockerfile',
  ) ||
  !ownerincDockerfile.includes(
    'NX_PARALLEL=1 npx nx run twenty-front:lingui:extract',
  ) ||
  !ownerincDockerfile.includes(
    'NX_PARALLEL=1 NODE_OPTIONS="--max-old-space-size=8192" npx nx build twenty-front',
  )
) {
  throw new Error(
    'Build Ownerinc do front não está protegido contra corrida concorrente do Nx.',
  );
}

for (const requiredLauncherContract of [
  'https://chatwoot.ownerinc.com.br',
  "OWNERINC_CHATWOOT_LABEL = 'Chatwoot'",
  '<NavigationDrawerItem',
  'alwaysShowRightOptions',
  'className="ownerinc-chatwoot-launcher"',
  'rightOptions=',
  'CHATWOOT_BRAND_BLUE',
  "'#1F93FF'",
  'OwnerincChatwootIcon',
]) {
  if (
    !chatwootLauncher.includes(requiredLauncherContract) &&
    !chatwootConstants.includes(requiredLauncherContract)
  ) {
    throw new Error(
      `Contrato do launcher Chatwoot ausente: ${requiredLauncherContract}`,
    );
  }
}

for (const requiredIconContract of [
  '<circle',
  'fill="#1F93FF"',
  'fill="white"',
  'scale(0.6212)',
]) {
  if (!chatwootIcon.includes(requiredIconContract)) {
    throw new Error(
      `Contrato visual do favicon Chatwoot ausente: ${requiredIconContract}`,
    );
  }
}

if (
  !mobileNavigationBar.includes("name: 'chatwoot'") ||
  !mobileNavigationBar.includes('OWNERINC_CHATWOOT_LABEL') ||
  !mobileNavigationBar.includes('openOwnerincChatwoot()') ||
  mobileNavigationBar.includes('newAiChat')
) {
  throw new Error('Navegação móvel não substituiu a IA pelo Chatwoot.');
}

for (const permissionSource of [frontPermissionHook, serverPermissions]) {
  if (
    !permissionSource.includes('OWNERINC_DISABLED_PERMISSION_FLAGS') ||
    !permissionSource.includes('PermissionFlagType.AI') ||
    !permissionSource.includes('PermissionFlagType.AI_SETTINGS')
  ) {
    throw new Error(
      'Bloqueio Ownerinc das permissões nativas de IA está incompleto.',
    );
  }
}

console.log(
  `Ownerinc customization: PASS (${entries.size} mensagens pt-BR, zero vazias, Chatwoot resiliente e IA nativa desativada).`,
);
