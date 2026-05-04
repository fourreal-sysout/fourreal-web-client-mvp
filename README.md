# 4REAL - Web Client MVP

Web client for the FourReal interactive fiction platform - built with React, TypeScript, and Vite.

## Contents

- [Ecosystem Architecture](#ecosystem-architecture)
- [Stack](#stack)
- [Quick Start](#quick-start)
- [Development](#development)
- [CI/CD](#cicd)
- [Development Standards](#development-standards)

## Ecosystem Architecture

```mermaid
graph TB
    subgraph "FourReal Game Ecosystem"
        Web[Web Client MVP<br/>React/TypeScript :5173]
        BFF[Game BFF<br/>Kotlin/Quarkus :8080]
        Player[Player State MS<br/>Kotlin/MongoDB :9000]
        Story[Story Resolver MS<br/>Python/Neo4j/Valkey :50051]
        Economy[Economy Ledger MS<br/>Rust/PostgreSQL :7000]
        Contracts[Contracts Repo<br/>Protobuf Definitions]
    end

    Web -->|REST 8080| BFF
    BFF -->|gRPC 9000| Player
    BFF -->|gRPC 50051| Story
    BFF -->|gRPC 7000| Economy

    Player -->|MongoDB| MongoDB[(MongoDB 6.0)]
    Story -->|Neo4j| Neo4j[(Neo4j 5.x)]
    Story -->|Valkey| Valkey[(Valkey 8.x)]

    BFF -.->|consumes stubs| Contracts
    Player -.->|consumes stubs| Contracts
    Story -.->|consumes stubs| Contracts
    Economy -.->|consumes stubs| Contracts

    style Web fill:#fce4ec
    style Web stroke:#c2185b
    style Web stroke-width:3px
```

## Stack

- **React 19** + **TypeScript**
- **Vite** (build tool & dev server)
- **TailwindCSS** (styling)
- **Axios** (HTTP client)

## Quick Start

```bash
npm install
npm run dev
```

## Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## CI/CD

This project uses GitHub Actions for continuous integration:

- **PR Workflow**: Runs tests, lint, and build verification on every pull request
- **Main Workflow**: Builds and publishes Docker images on merge to main
- **E2E Trigger**: Disabled (manual trigger only)

See [`.github/workflows/ci.yml`](.github/workflows/ci.yml) for details.

## Development Standards

This project follows standardized development practices across the FourReal ecosystem:

- **Commit messages**: Must follow [Conventional Commits](https://www.conventionalcommits.org/) format (enforced locally via commitlint + husky)
- **Pull requests**: Must use the provided PR template with all required sections
- **CI**: Automated checks run on PRs via GitHub Actions

See `.commitlintrc.json` for commit message rules and `.github/pull_request_template.md` for PR requirements.
