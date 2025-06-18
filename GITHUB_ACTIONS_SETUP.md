# GitHub Actions Setup for NPM Publishing

This repository is configured to automatically publish the `@dbcode/vscode-api` package to NPM using a single, comprehensive GitHub Actions workflow.

## Prerequisites

1. **NPM Account**: You need an NPM account with access to publish the `@dbcode` organization packages
2. **GitHub Repository Secrets**: Set up the required NPM token secret

## Required GitHub Secrets

Navigate to your repository Settings → Secrets and variables → Actions, and add:

### `NPM_TOKEN`
1. Go to [npmjs.com](https://www.npmjs.com) and log in
2. Click on your profile → Access Tokens
3. Generate a new Classic Token with "Automation" type
4. Copy the token and add it as `NPM_TOKEN` in GitHub secrets

## Workflows

### Release Workflow (`.github/workflows/release.yml`)
- Manual workflow for creating releases and publishing to NPM
- Comprehensive testing and verification before publishing:
  - Installs dependencies and builds the package
  - Runs all tests (if any)
  - Verifies TypeScript compilation
  - Checks build artifacts and package structure
  - Validates package contents
- Allows version bumping (patch, minor, major) or custom version
- Automatically commits version changes, creates tags, and publishes to NPM
- Creates GitHub releases with changelog
- Only publishes if ALL checks pass

## How to Release

### Using the Release Workflow
1. Go to the "Actions" tab in your GitHub repository
2. Select "Release" workflow
3. Click "Run workflow"
4. Choose version bump type (patch, minor, major) or enter a custom version
5. The workflow will:
   - Install dependencies and build the package
   - Run comprehensive tests and TypeScript compilation checks
   - Verify build artifacts and package contents
   - Only proceed if all checks pass
   - Bump the version in package.json
   - Commit and tag the changes
   - Publish to NPM with provenance
   - Create a GitHub release

This single workflow handles everything needed for a safe release!

## Package Configuration

The package is configured to:
- Build TypeScript to the `dist/` directory
- Include type definitions (`dist/index.d.ts`)
- Publish only necessary files (see `.npmignore`)
- Use npm provenance for security
- Be published as a public package under `@dbcode` organization

