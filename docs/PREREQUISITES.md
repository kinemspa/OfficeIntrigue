# Prerequisites

## Required Software

### Node.js

- **Version**: LTS 20.x or later (currently v22.17.0 installed)
- **Install**: `winget install OpenJS.NodeJS.LTS`
- **Verify**: `node -v`

### npm

- **Version**: 9.x or later (currently 11.5.2 installed)
- **Included**: Comes with Node.js
- **Verify**: `npm -v`

### Git

- **Version**: 2.40 or later (currently 2.49.0 installed)
- **Install**: `winget install Git.Git`
- **Verify**: `git --version`

### Azure CLI (Optional for cloud deployment)

- **Version**: Latest
- **Install**: `winget install Microsoft.AzureCLI`
- **Verify**: `az --version`

### ngrok (Optional for local Teams testing)

- **Version**: Latest
- **Install**: `winget install Ngrok.Ngrok`
- **Purpose**: Exposes local development server for Teams Bot Framework

### Teams Toolkit for VS Code

- **Install**: Search for "Teams Toolkit" in VS Code Extensions
- **Extension ID**: TeamsDevApp.ms-teams-vscode-extension
- **Purpose**: Sideload and debug Teams apps locally

## Azure Resources Required (Production)

- Azure App Service (Node.js runtime)
- Azure Cosmos DB (SQL API)
- Microsoft Entra ID App Registration
- Application Insights (optional, recommended)

## Development Environment

- **OS**: Windows, macOS, or Linux
- **IDE**: Visual Studio Code (recommended)
- **Shell**: PowerShell, Bash, or Zsh

## Next Steps

After verifying prerequisites, proceed to:

1. `npm install` - Install project dependencies
2. Configure `.env` file (see `docs/CONFIGURATION.md`)
3. Run `npm run dev` for local development
