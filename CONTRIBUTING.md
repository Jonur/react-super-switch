# Contributing

Thanks for contributing to `react-super-switch`! This document describes the local dev workflow and the release/publish process.

## Prerequisites

- Node.js: use the version in `.nvmrc` (recommended)
- npm
- Git
- You should have permission to create tags and releases on GitHub

## Useful commands

- `npm run all`
  Runs the full local verification suite (typecheck, lint, tests with coverage, build).

- `npm run typecheck`
  Type-checks the project using the main `tsconfig.json`.

- `npm run lint` / `npm run lint:fix`
  Lints the codebase (and optionally auto-fixes issues).

- `npm run test:coverage`
  Runs tests once (CI-friendly) and enforces coverage thresholds.

- `npm run build`
  Builds the library bundle and generates type declarations.

## Development workflow

A typical local loop:

```bash
npm install
npm run all
```

Before opening a PR, please make sure `npm run all` passes.

## Release process (publish to npm)

Publishing is done via GitHub Actions on GitHub Release publish.

High-level overview:

- Update package.json version (without tagging)
- Push the version bump to main
- Create a git tag that matches the package.json version and push it
- Create a GitHub Release from that tag (this triggers the npm publish workflow)

### Step-by-step

#### TL;DR version

1. Finish your changes locally
2. Run `npm run npmv`
3. Commit and push
4. Run `npm run tag`

#### 1) Verify everything is green locally

```bash
npm run all
```

#### 2) Bump the patch version (no git tag)

This updates package.json + package-lock.json:

```bash
npm run npmv
```

> `npm run npmv` runs: `npm version patch --no-git-tag-version`. It bumps the patch version but does not create a git tag.

If you want a different bump (minor/major), run one of these manually:

```bash
npm version minor --no-git-tag-version
# or
npm version major --no-git-tag-version
```

#### 3) Commit and push the version bump

```bash
git add package.json package-lock.json
git commit -m "chore: release $(node -p \"require('./package.json').version\")"
git push origin main
```

#### 4) Create and push the git tag (matches package.json)

```bash
npm run tag
```

`npm run tag` reads the version from package.json and runs:

- git tag <version>
- git push origin <version>

#### 5) Create a GitHub Release

On GitHub:

- Go to Releases → Draft a new release
- Choose the tag you just pushed (e.g. 1.0.3)
- Release title: the same version (e.g. 1.0.3)
- Click Publish release

Publishing the release triggers the GitHub Actions workflow which runs:

- install (`npm ci`)
- `npm run typecheck`
- `npm run lint`
- `npm run test:coverage`
- `npm run build`
- `npm publish`

If the workflow succeeds, the new version will be available on npm.

## NPM token / CI publishing notes

The GitHub Actions publish workflow uses an npm token stored in the repo secrets as:

- **Secret name:** `NPM_TOKEN`

⚠️ If the publish step suddenly starts failing with auth/permission errors, the token may have expired.

**Reminder:** the `NPM_TOKEN` used for CI has a validity of **90 days**.

When it expires:

1. Go to npm → Account settings → Access Tokens
2. Create a new token (Automation token recommended for CI)
3. Update the GitHub repo secret `NPM_TOKEN` with the new value
4. Re-run the workflow (or publish the release again if needed)
