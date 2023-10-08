# Simple Landing Page
Azure Staic Web App that collect email from user and send it to Azure Function backend and then save it to database

## Local Test & Run
Run `swa start src --api-location api --data-api-location swa-db-connections` at the project root to spin up front end and back end.

## Reference
- [Azure Static Web App Documentation](https://learn.microsoft.com/en-us/azure/static-web-apps/database-overview)
- [Connect CosmosDB to Static Web App](https://learn.microsoft.com/en-us/azure/static-web-apps/database-azure-cosmos-db?tabs=bash)

## Glossary
- `http://localhost:4280/` serve the static web app
- `http://localhost:7071/` serve the Azure Function endpoint