# Changelog

Notable user-facing changes to this project are documented here. The format is
based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and future
releases should use [Semantic Versioning](https://semver.org/).

Add upcoming changes under **Unreleased**, grouped under headings such as
**Added**, **Changed**, **Fixed**, or **Removed**. When publishing a release,
move those entries into a versioned section and include the release date.

The history below was reconstructed from the first-parent Git history on
`main` through 2026-11-23. This repository has no release tags, so the dated
sections are development milestones, not formal releases.

## [Unreleased]

### Added

- Added a Markdown version of the landing page and linked it from the site
  metadata and AI-friendly site index.
- Added visible fallback content to the landing page for improved crawling and
  access when JavaScript is unavailable.

### Changed

- Replaced the landing page's static card hero with a muted, looping campaign
  video.
- Made the landing page's primary action copy a short request linking to the
  creative brief and removed the device share-sheet and image-copy actions.
- Allowed an explicit request to apply the linked creative brief to activate the
  experience and linked directly to the full brief for manual copying.
- Updated the README and AI-friendly site index to describe the simplified
  prompt-only workflow and Markdown landing-page URL.

### Fixed

- Normalized HTML doctype declarations and void-element syntax across the
  landing page, creative brief, and custom not-found page.

## Development history

### 2026-11-23

#### Added

- Added a custom GitHub Pages not-found page.
- Published the creative brief in Markdown and added an AI-friendly `llms.txt`
  site index.

#### Changed

- Improved the site's accessibility and usability and refined clipboard
  recovery behavior.

### 2026-11-18

#### Added

- Added mobile sharing flows that can share the campaign card with its prompt
  through the device share sheet.

#### Changed

- Refined the card artwork, sharing and clipboard fallbacks, and responsive
  presentation.

### 2026-11-17

#### Added

- Added clipboard recovery for mobile copy-and-paste and introduced device share
  sheet support.

#### Changed

- Updated the prompt and creative brief, including design specifications and
  project timeline.

### 2026-11-13

#### Added

- Introduced the static campaign site, including its landing page, creative
  brief, branded assets, and GitHub Pages configuration.
- Added AI interaction guidance to the creative brief and social preview
  metadata.

#### Changed

- Refined campaign content and social preview artwork.
