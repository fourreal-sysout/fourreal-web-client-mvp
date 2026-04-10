# FourReal Web Client MVP

Temporary Web client for the FourReal interactive fiction platform - built with React, TypeScript, and Vite.

## Contents

- [Ecosystem Architecture](#ecosystem-architecture)
- [Stack](#stack)
- [Quick Start](#quick-start)
- [Development](#development)
- [Development Standards](#development-standards)

## Ecosystem Architecture

```mermaid
graph TB
    subgraph "FourReal Ecosystem"
        Web[Web Client<br/>React/TypeScript]
        BFF[Game BFF<br/>Kotlin/Quarkus]
        Player[Player State MS<br/>Kotlin/MongoDB]
        Story[Story Resolver MS<br/>Python/Neo4j/Valkey]
        Contracts[Contracts Repo<br/>Protobuf Definitions]
    end

    Web -->|REST:8080| BFF
    BFF -->|gRPC:9000| Player
    BFF -->|gRPC:50051| Story

    Player -->|MongoDB| MongoDB[(MongoDB)]
    Story -->|Neo4j| Neo4j[(Neo4j)]
    Story -->|Valkey| Valkey[(Valkey)]

    BFF -.->|consumes stubs| Contracts
    Player -.->|consumes stubs| Contracts
    Story -.->|consumes stubs| Contracts

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

## Development Standards

This project follows standardized development practices across the FourReal ecosystem:

- **Commit messages**: Must follow [Conventional Commits](https://www.conventionalcommits.org/) format (enforced locally via commitlint + husky)
- **Pull requests**: Must use the provided PR template with all required sections

See `.commitlintrc.json` for commit message rules and `.github/pull_request_template.md` for PR requirements.
