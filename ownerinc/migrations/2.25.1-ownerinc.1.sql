BEGIN;

-- Idempotent compatibility layer for existing workspaces upgraded from
-- upstream v2.24.x to Ownerinc v2.25.1.
UPDATE core."navigationMenuItem"
SET
  name = 'Automações',
  "updatedAt" = NOW()
WHERE
  "universalIdentifier" = '20202020-b007-4b07-8b07-c0aba11c0007'
  AND name = 'Workflows';

UPDATE core."commandMenuItem"
SET
  label = 'Criar ${capitalize(objectMetadataItem.labelSingular)}',
  "shortLabel" = 'Criar ${capitalize(objectMetadataItem.labelSingular)}',
  "updatedAt" = NOW()
WHERE
  "universalIdentifier" = '08d255bf-58cd-47a5-bd82-78c5c58592f1'
  AND label = 'Create new ${capitalize(objectMetadataItem.labelSingular)}'
  AND "shortLabel" = 'New ${capitalize(objectMetadataItem.labelSingular)}';

UPDATE core."commandMenuItem" AS item
SET
  label = translated.label,
  "shortLabel" = translated."shortLabel",
  "updatedAt" = NOW()
FROM (
  VALUES
    (
      '96457c5a-b028-4d48-94e3-27f4c41296b8'::uuid,
      'Redigir e-mail',
      'Redigir'
    ),
    (
      '30473656-e7cb-42e0-b198-6c4e8b906106'::uuid,
      'Redigir campanha',
      'Campanha'
    ),
    (
      '7ad6f0c7-ac02-4062-b5cf-1f36e1664bc8'::uuid,
      'Criar campanha',
      'Criar campanha'
    ),
    (
      'b08f4ccd-070b-460f-a4b6-6d0c14f1c44d'::uuid,
      'Enviar campanha',
      'Enviar'
    ),
    (
      'a6e6fd08-2c75-4d43-8795-1baafbac165e'::uuid,
      'Enviar e-mail de teste',
      'Testar'
    )
) AS translated("universalIdentifier", label, "shortLabel")
WHERE
  item."universalIdentifier" = translated."universalIdentifier"
  AND (
    item.label IS DISTINCT FROM translated.label
    OR item."shortLabel" IS DISTINCT FROM translated."shortLabel"
  );

-- Request handling and transactional e-mails resolve the locale from
-- userWorkspace before falling back to user. Keep both records aligned.
UPDATE core."userWorkspace" AS user_workspace
SET
  locale = 'pt-BR',
  "updatedAt" = NOW()
FROM core."user" AS app_user
WHERE
  user_workspace."userId" = app_user.id
  AND app_user.locale = 'pt-BR'
  AND user_workspace.locale IS DISTINCT FROM 'pt-BR';

COMMIT;
