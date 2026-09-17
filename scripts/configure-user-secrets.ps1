#!/usr/bin/env pwsh

<#
.SYNOPSIS
Configures SmartDevApp Function user secrets for host-based local development.

.DESCRIPTION
Reads only the local Microsoft Entra identifiers from the repository-root .env file,
then writes local emulator and fake integration settings through .NET user secrets.
Cosmos DB, Service Bus, Storage, Speech, and Communication Services stay local for
host-based development and do not use deployed Azure resources.

.EXAMPLE
./scripts/configure-user-secrets.ps1
#>

[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Import-Module -Name (Join-Path -Path $PSScriptRoot -ChildPath "ScriptHelpers.psm1") -Force

function Invoke-Main {
    [CmdletBinding()]
    param()

    # Environment
    $repoRoot = Split-Path -Path $PSScriptRoot -Parent
    $envFile = Join-Path -Path $repoRoot -ChildPath ".env"
    Import-DotEnv -Path $envFile

    # Variables
    $apiProject = Resolve-RepoPath -Path "backend/SmartDev.Api.Functions/SmartDev.Api.Functions.csproj" -RepoRoot $repoRoot
    $workerProject = Resolve-RepoPath -Path "backend/SmartDev.Worker.Functions/SmartDev.Worker.Functions.csproj" -RepoRoot $repoRoot
    $tenantId = [guid](Get-Config -Name "API_ENTRA_TENANT_ID")
    $ownerObjectId = [guid](Get-Config -Name "API_ENTRA_OWNER_OBJECT_ID")
    $apiAudience = Get-Config -Name "API_ENTRA_AUDIENCE"
    $storageConnectionString = "UseDevelopmentStorage=true"
    $serviceBusConnectionString = "Endpoint=sb://localhost;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;"
    $cosmosConnectionString = "AccountEndpoint=https://localhost:8081/;AccountKey=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==;"
    $dotnetAvailable = Test-CommandAvailable -Name "dotnet"

    $apiKeysToRemove = @(
        "APPLICATIONINSIGHTS_CONNECTION_STRING"
        "ArticleAudioStorage:ConnectionString"
        "AzureCommunicationService:ConnectionString"
        "AzureCommunicationService:SenderAddress"
        "AzureSpeech:Key"
        "AzureSpeech:Region"
        "AzureSpeech:VoiceName"
        "ConnectionStrings:SmartDev"
        "Entra:ClientId"
        "MicrosoftGraph:ClientId"
        "MicrosoftGraph:ClientSecret"
        "Observability:ApplicationInsightsConnectionString"
    )
    $apiSettings = [ordered]@{
        "AzureServiceBus" = $serviceBusConnectionString
        "AzureWebJobsStorage" = $storageConnectionString
        "ArticleAudioStorage:ContainerName" = "article-audio"
        "CosmosDb:ConnectionString" = $cosmosConnectionString
        "CosmosDb:DatabaseName" = "smartdev"
        "CosmosDb:DefaultTimeToLiveSeconds" = "86400"
        "CosmosDb:Throughput" = "1000"
        "Cors:AllowedOrigins:0" = "http://localhost:5173"
        "EntraId:TenantId" = $tenantId.ToString()
        "EntraId:Audience" = $apiAudience
        "EntraId:OwnerObjectId" = $ownerObjectId.ToString()
        "LoggingOptions:ServiceName" = "SmartDev.Api.Functions"
        "Observability:OtlpEndpoint" = "http://localhost:4317"
    }

    $workerKeysToRemove = @(
        "APPLICATIONINSIGHTS_CONNECTION_STRING"
        "ArticleAudioStorage:ConnectionString"
        "AzureCommunicationService:ConnectionString"
        "AzureSpeech:Key"
        "AzureSpeech:Region"
        "AzureSpeech:VoiceName"
        "ConnectionStrings:SmartDev"
        "CosmosDb:ConnectionString"
        "CosmosDb:DatabaseName"
        "CosmosDb:DefaultTimeToLiveSeconds"
        "CosmosDb:Throughput"
        "Entra:ClientId"
        "MicrosoftGraph:ClientId"
        "MicrosoftGraph:ClientSecret"
        "Observability:ApplicationInsightsConnectionString"
    )
    $workerSettings = [ordered]@{
        "AzureServiceBus" = $serviceBusConnectionString
        "AzureWebJobsStorage" = $storageConnectionString
        "ArticleAudioStorage:ContainerName" = "article-audio"
        "AzureCommunicationService:ConnectionString" = "endpoint=https://localhost/;accesskey=fake"
        "AzureCommunicationService:SenderAddress" = "DoNotReply@localhost"
        "AzureSpeech:Enabled" = "false"
        "LoggingOptions:ServiceName" = "SmartDev.Worker.Functions"
        "Observability:OtlpEndpoint" = "http://localhost:4317"
    }

    # Validation
    if (-not $dotnetAvailable) { throw ".NET SDK was not found. Install the .NET SDK, then run this script again." }

    # User-secret configuration
    Set-SmartDevUserSecrets -ProjectPath $apiProject -ProjectLabel "SmartDev API Functions" -KeysToRemove $apiKeysToRemove -Settings $apiSettings
    Set-SmartDevUserSecrets -ProjectPath $workerProject -ProjectLabel "SmartDev Worker Functions" -KeysToRemove $workerKeysToRemove -Settings $workerSettings

    Write-Host -Object "SmartDevApp local user secrets configured." -ForegroundColor Green
    Write-Host -Object "Local Cosmos DB, Service Bus, Storage, Communication email, and Speech use emulator or fake settings." -ForegroundColor Green
}

<#
.SYNOPSIS
Initializes user secrets, removes stale keys, and applies the current local settings.

.PARAMETER ProjectPath
Path to the project file.

.PARAMETER ProjectLabel
Human-readable project name used in status output.

.PARAMETER KeysToRemove
User-secret keys removed before the current settings are applied.

.PARAMETER Settings
User-secret key-value pairs written to the project.
#>
function Set-SmartDevUserSecrets {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)] [string]$ProjectPath,
        [Parameter(Mandatory)] [string]$ProjectLabel,
        [Parameter(Mandatory)] [string[]]$KeysToRemove,
        [Parameter(Mandatory)] [System.Collections.IDictionary]$Settings
    )

    dotnet user-secrets init --project $ProjectPath | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "Initializing user secrets for '$ProjectLabel' failed with exit code $LASTEXITCODE." }

    foreach ($key in $KeysToRemove) {
        dotnet user-secrets remove $key --project $ProjectPath | Out-Null
        if ($LASTEXITCODE -ne 0) { throw "Removing user secret '$key' for '$ProjectLabel' failed with exit code $LASTEXITCODE." }
    }

    foreach ($setting in $Settings.GetEnumerator()) {
        dotnet user-secrets set $setting.Key $setting.Value --project $ProjectPath | Out-Null
        if ($LASTEXITCODE -ne 0) { throw "Setting user secret '$($setting.Key)' for '$ProjectLabel' failed with exit code $LASTEXITCODE." }
    }

    Write-Host -Object "$ProjectLabel user secrets configured." -ForegroundColor Green
}

Invoke-Main
