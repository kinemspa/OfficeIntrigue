# WARP.md Integration

## Overview

This document describes the addition of WARP.md to the OfficeIntrigue repository for improved AI-assisted development with Warp.dev.

## Purpose

WARP.md provides comprehensive guidance for Warp AI when working with code in this repository, including:

- Essential development commands
- Architecture overview
- OpenSpec workflow integration
- Configuration guidance
- Common development workflows

## Location

- **File**: `WARP.md` (repository root)
- **Reference**: Added to README.md documentation section

## Contents

### Key Sections

1. **Project Overview** - Current status and tech stack
2. **Essential Commands** - npm scripts for development, quality, and utilities
3. **Architecture** - Application modes, core structure, multi-tenant design
4. **OpenSpec Workflow** - Spec-driven development process
5. **Configuration** - Environment setup for web and Teams modes
6. **Storage** - Development (MemoryStorage) vs Production (Cosmos DB)
7. **Key Concepts** - Game mechanics, roles, integrity meter, states
8. **Testing** - Jest configuration status and guidelines
9. **Documentation** - Links to all project documentation
10. **Common Workflows** - Practical guides for common tasks

## Integration Points

### README.md

Added reference to WARP.md in the Documentation section:

```markdown
- [WARP.md](WARP.md) - Guidance for Warp AI development
```

### OpenSpec Workflow

WARP.md emphasizes the project's spec-driven development approach:

- References `openspec/AGENTS.md` for complete workflow
- Documents change proposal process
- Emphasizes approval requirement before implementation

## Maintenance

WARP.md should be updated when:

- New npm scripts are added
- Architecture changes significantly
- New documentation is added
- Development workflows change
- Configuration requirements evolve

## Related Documentation

- [README.md](../README.md) - Project overview
- [docs/ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [openspec/AGENTS.md](../openspec/AGENTS.md) - AI assistant instructions

## Change Log

- **2025-10-17**: Initial WARP.md creation with comprehensive development guidance
