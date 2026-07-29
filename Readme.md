# 💼 SmartDevApp

![.NET](https://img.shields.io/badge/.NET-8-512BD4?logo=dotnet&logoColor=white)
![Azure Functions](https://img.shields.io/badge/Azure_Functions-v4-0062AD?logo=azurefunctions&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![OpenTelemetry](https://img.shields.io/badge/OpenTelemetry-Enabled-000000?logo=opentelemetry&logoColor=white)

SmartDevApp is my full-stack developer portfolio and contact platform. It helps visitors explore my professional experience, technical skills, featured work, personal projects, portfolio case studies, and contact details.

The frontend is deliberately lightweight and built with plain HTML, CSS, and TypeScript. Vite is used as the build tool, not as an application framework.

The backend is a cloud-native .NET Azure Functions system. The API Functions project accepts public contact form submissions, stores contact message state in Cosmos DB, publishes an integration event to Azure Service Bus, and later consumes the worker delivery result to update the document status. The Worker Functions project consumes contact-message events, sends email through Azure Communication Services, and publishes the delivery outcome back to the API boundary.

## 🧭 System Design

SmartDevApp is split across separately deployable frontend, API Functions, and Worker Functions components. The API owns public HTTP workflows and contact-message state. The worker owns email delivery. Azure Service Bus connects the function boundaries with explicit queues, Cosmos DB stores contact-message documents, Azurite supports local Functions storage, and OpenTelemetry exports logs and traces for local and cloud observability.

![SmartDevApp system design](docs/systemDesign.png)

## ✨ Features

- Static portfolio landing page
- Professional work and personal project detail pages
- JSON-backed portfolio content
- Public contact form endpoint
- Explicit CORS middleware for browser callers
- In-memory HTTP rate limiting for public endpoints
- Cosmos DB contact-message document storage
- Azure Service Bus integration events
- Worker-based contact email delivery
- Delivery-result event back to the API Functions boundary
- Azure Communication Services email adapter
- Local email sender for development
- Serilog console and file logging
- OpenTelemetry export with Application Insights support
- Docker Compose local cloud emulator stack

## 🧰 Technology Stack

### ☁️ Azure-Native Services

- **Azure Functions v4** for API and worker execution
- **Azure Static Web Apps** for frontend hosting
- **Azure Service Bus** for cross-function integration events
- **Azure Cosmos DB** for contact-message document storage
- **Azure Communication Services** for email delivery
- **Azure Storage** for Functions runtime storage
- **Application Insights** for observability
- **OpenTelemetry** for logs, traces, and metrics export

### ⚙️ Backend

- .NET 8
- Azure Functions isolated worker
- Azure Functions HTTP triggers
- Azure Functions Service Bus triggers
- Azure.Messaging.ServiceBus
- Azure Cosmos DB SDK
- Azure Communication Services Email
- Clean architecture enforced inside function projects with namespaces and folders
- Domain-driven contact-message model
- Application use-case handlers
- Infrastructure adapters for Cosmos DB, Service Bus, and email
- Strongly typed options configuration
- Serilog
- OpenTelemetry

### 🖥️ Frontend

- Vite 5
- TypeScript 5
- HTML
- CSS
- Static Web Apps configuration
- JSON portfolio content

### 🐳 Local Infrastructure

- Docker Compose
- Azure Cosmos DB emulator
- Azure Service Bus emulator
- Azurite for local Azure Storage emulation
- OpenTelemetry collector
- PowerShell helper scripts

## 🏗️ Project Architecture

### Backend

```text
backend/
├── SmartDev.Api.Functions/       # HTTP trigger, status-result trigger, API-owned domain/application/infra
├── SmartDev.Worker.Functions/    # Service Bus trigger, email use case, worker-owned application/infra
├── SmartDev.Shared/              # Shared messaging contracts, queue names, Service Bus publisher
└── SmartDev.slnx                 # .NET solution file
```

### API Functions

```text
backend/SmartDev.Api.Functions/
├── Application/      # Contact-message use cases, ports, domain event dispatching
├── Configuration/    # Host setup, DI registration, options, CORS and rate-limit middleware
├── Domain/           # Contact, content, and portfolio domain models
├── Functions/        # Azure Functions presentation layer
├── Infrastructure/   # Cosmos DB document store and persistence models
├── host.json         # Host and application configuration
└── Program.cs        # Functions host startup
```

### Worker Functions

```text
backend/SmartDev.Worker.Functions/
├── Application/      # Send-contact-email use case and email port
├── Configuration/    # Host setup, DI registration, logging, observability
├── Functions/        # Service Bus trigger presentation layer
├── Infrastructure/   # Azure Communication Services and local email adapters
├── host.json         # Worker application configuration
└── Program.cs        # Functions host startup
```

### Shared

```text
backend/SmartDev.Shared/
├── Messaging/        # Integration event contracts, queue topology, Service Bus publisher
└── Options/          # Shared configuration options
```

### Frontend

```text
frontend/
├── pages/            # Portfolio detail pages
├── public/           # Static images and portfolio JSON data
├── src/              # TypeScript and styling
├── index.html        # Main portfolio page
├── staticwebapp.config.json
├── package.json
└── vite.config.ts
```

### Docker

```text
docker/
├── api-functions.dockerfile
├── docker-compose.yml
├── frontend.dockerfile
├── otel-collector-config.yml
├── serviceBusConfig.json
└── worker-functions.dockerfile
```

## 🔁 Contact Email Workflow

```text
Frontend
  -> POST /api/contactEmail
  -> SmartDev.Api.Functions ContactEmailFunction
  -> Cosmos DB contact message document
  -> contact-message-created queue
  -> SmartDev.Worker.Functions SendContactEmailFunction
  -> Azure Communication Services or local email sender
  -> contact-email-delivery-result queue
  -> SmartDev.Api.Functions UpdateContactEmailStatusFunction
  -> Cosmos DB contact message status update
```

The queue names and integration contracts live in `SmartDev.Shared` so both function apps share only the messaging boundary, not each other's application or infrastructure code.

## 🚀 Getting Started

### Prerequisites

- .NET 8 SDK
- Azure Functions Core Tools v4
- Node.js 20+
- Docker Desktop
- PowerShell 7+

## 🐳 Run With Docker

From the repository root:

```powershell
./scripts/compose.ps1
```

This stops the current compose environment, rebuilds images, and starts the local stack using:

```text
docker/docker-compose.yml
```

Main local services:

```text
Frontend:             http://localhost:5173
API Functions:        http://localhost:7084
Worker Functions:     worker container
Cosmos DB Emulator:   https://localhost:8081
Azurite Blob:         http://localhost:10000
Azurite Queue:        http://localhost:10001
Azurite Table:        http://localhost:10002
Service Bus AMQP:     localhost:5672
Service Bus Admin:    localhost:5300
OTLP gRPC:            localhost:4317
OTLP HTTP:            localhost:4318
```

Docker writes function logs to:

```text
.tmp/logs/api-functions
.tmp/logs/worker-functions
```

## ⚙️ Backend Setup

Restore and build the full backend solution:

```powershell
dotnet restore backend/SmartDev.slnx
dotnet build backend/SmartDev.slnx
```

Run the API Functions app locally:

```powershell
dotnet run --project backend/SmartDev.Api.Functions
```

Run the Worker Functions app locally:

```powershell
dotnet run --project backend/SmartDev.Worker.Functions
```

The API project uses port `7084` from `launchSettings.json`. The worker project uses port `7177` so both function hosts can run at the same time.

When running against the Docker Cosmos DB emulator from the host machine, trust the emulator certificate:

```powershell
./scripts/cosmos-cert.ps1
```

Local Azure Functions settings belong in each function project's `local.settings.json`. The flat `AzureServiceBus` setting is required by Azure Functions Service Bus triggers, while structured options in `host.json` configure the application services.

## 🖥️ Frontend Setup

From the frontend directory:

```powershell
cd frontend
npm install
npm run dev
```

Useful commands:

```powershell
npm run build
npm run preview
```

The Docker environment sets the frontend API base URL to:

```text
http://localhost:7084
```

For local frontend-only development, use a local `.env` file and keep it out of source control.
