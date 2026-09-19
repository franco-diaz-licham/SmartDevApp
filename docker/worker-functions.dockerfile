# Multi-stage Dockerfile for SmartDev.Worker.Functions (builds in the SDK image, runs on Azure Functions isolated runtime)

# ---------- Build stage ----------
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy the solution and project files first so Docker can cache restore layers
COPY src/SmartDev.slnx ./src/
COPY src/SmartDev.Shared/SmartDev.Shared.csproj ./src/SmartDev.Shared/
COPY src/SmartDev.Worker.Functions/SmartDev.Worker.Functions.csproj ./src/SmartDev.Worker.Functions/

# Restore dependencies for the Worker Functions project
RUN dotnet restore src/SmartDev.Worker.Functions/SmartDev.Worker.Functions.csproj

# Copy all source code
COPY src/ ./src/

# Publish the Worker Functions project into the Azure Functions script root
RUN dotnet publish src/SmartDev.Worker.Functions/SmartDev.Worker.Functions.csproj \
    -c Release \
    -o /home/site/wwwroot \
    --no-restore

# ---------- Runtime stage ----------
FROM mcr.microsoft.com/azure-functions/dotnet-isolated:4-dotnet-isolated10.0 AS runtime

# Configure the Azure Functions host
ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true \
    FUNCTIONS_WORKER_RUNTIME=dotnet-isolated

# Copy published output from build stage
COPY --from=build /home/site/wwwroot /home/site/wwwroot
