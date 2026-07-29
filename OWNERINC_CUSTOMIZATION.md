# Ownerinc CRM customization

This public fork contains the narrow customization layer used by
`https://crm.ownerinc.com.br/`.

## Release baseline

- upstream project: `twentyhq/twenty`;
- upstream tag: `twenty/v2.24.0`;
- Ownerinc release: `2.24.0-ownerinc.1`;
- production architecture: the same image runs the `server` and `worker`
  services, while PostgreSQL and Redis remain private.

## What is customized

- complete Brazilian Portuguese catalog, with an Ownerinc overlay applied
  after every Lingui extraction;
- zero empty `msgstr` entries is a blocking build gate;
- Raleway is self-hosted and used in the light and dark themes;
- official Ownerinc favicon replaces the default product mark in browser,
  authentication and onboarding surfaces;
- public metadata and PWA manifest identify the application as
  `Ownerinc CRM`;
- login and password reset show one workspace logo instead of product logo
  plus a duplicated workspace badge.

The core layout, record components, status colors and accessibility behavior
remain upstream. This keeps dense CRM screens predictable and minimizes merge
risk.

## Sources and licensing

- Twenty remains licensed under the repository's upstream licenses, including
  AGPL-3.0 where applicable. The modified source is public at
  `https://github.com/OWNERINC/twenty`.
- Ownerinc icon source:
  `https://ownerinc.com.br/wp-content/uploads/2025/05/cropped-FAVICON-Ownerinc-02-192x192.png`.
- canonical source icon SHA-256:
  `0f45c70f876c46b1ec76a4af0be18be8039981ea661945566a04b722ef365f76`.
- Raleway is distributed under the SIL Open Font License. A copy is stored at
  `ownerinc/brand/OFL-Raleway.txt`.

## Upgrade procedure

Do not update production directly from `twentyhq/twenty:latest`.

1. Fetch the desired upstream release and review its release notes.
2. Create a new branch from the exact upstream tag:
   `ownerinc/<upstream-version>-ptbr-brand`.
3. Reapply or rebase the Ownerinc commits.
4. Run:

   ```bash
   node ownerinc/scripts/apply-ptbr-overrides.mjs
   node ownerinc/scripts/verify-customization.mjs
   ```

5. Extend `pt-BR-overrides.json` for every newly extracted untranslated
   message. The build must keep zero empty translations.
6. Build the exact branch with the repository Dockerfile:

   ```bash
   docker build \
     --target twenty \
     --build-arg APP_VERSION=<upstream-version>-ownerinc.<release> \
     --tag ownerinc/twenty:<upstream-version>-ownerinc.<release> \
     --file packages/twenty-docker/twenty/Dockerfile \
     .
   ```

   The pinned GitHub Actions template lives at
   `ownerinc/ci/ownerinc-build.yaml`. Install it as
   `.github/workflows/ownerinc-build.yaml` only from an account or token with
   explicit workflow permission.
7. Before promotion, create and verify a Twenty backup.
8. Deploy the exact locally inspected image ID or registry digest to both
   `server` and `worker`.
9. Validate health, background jobs, login, desktop and mobile views, pt-BR,
   fonts, logo and browser metadata.
10. Record the upstream tag, fork commit, image digest, backup path and QA
    result in the Ownerinc Harness.

## Rollback

Rollback is a Compose image-only operation:

1. restore the previous immutable image digest for both application services;
2. recreate only `server` and `worker`;
3. verify health, queues and public HTTPS;
4. restore the database backup only if the upstream release included a
   non-backward-compatible migration.

Never store SMTP credentials, tokens, database secrets or `.env` contents in
this repository.
