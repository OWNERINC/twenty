BEGIN;

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

COMMIT;
