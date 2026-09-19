#!/usr/bin/env pwsh

<#
.SYNOPSIS
Configures SmartDevApp API user secrets for host-based local development.

.DESCRIPTION
Reads the local Microsoft Entra identifiers from the repository-root .env file,
then writes the API settings through .NET user secrets.

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
    $apiProject = Resolve-RepoPath -Path "src/SmartDev.Api.Functions/SmartDev.Api.Functions.csproj" -RepoRoot $repoRoot
    $tenantId = [guid](Get-Config -Name "API_ENTRA_TENANT_ID")
    $ownerObjectId = [guid](Get-Config -Name "API_ENTRA_OWNER_OBJECT_ID")
    $apiAudience = Get-Config -Name "API_ENTRA_AUDIENCE"
    $userSecretSettings = [ordered]@{
        "EntraId:TenantId" = $tenantId.ToString()
        "EntraId:Audience" = $apiAudience
        "EntraId:OwnerObjectId" = $ownerObjectId.ToString()
    }
    $dotnetAvailable = Test-CommandAvailable -Name "dotnet"

    # Validation
    if (-not $dotnetAvailable) { throw ".NET SDK was not found. Install the .NET SDK, then run this script again." }

    # User-secret configuration
    Set-SmartDevApiUserSecrets -ProjectPath $apiProject -Settings $userSecretSettings

    Write-Host -Object "SmartDevApp API user secrets configured." -ForegroundColor Green
}

<#
.SYNOPSIS
Applies the current local API user-secret settings.

.PARAMETER ProjectPath
Path to the SmartDevApp API project file.

.PARAMETER Settings
User-secret key-value pairs written to the API project.
#>
function Set-SmartDevApiUserSecrets {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)] [string]$ProjectPath,
        [Parameter(Mandatory)] [System.Collections.IDictionary]$Settings
    )

    foreach ($setting in $Settings.GetEnumerator()) {
        dotnet user-secrets set $setting.Key $setting.Value --project $ProjectPath
        if ($LASTEXITCODE -ne 0) { throw "Setting user secret '$($setting.Key)' failed with exit code $LASTEXITCODE." }
    }
}

Invoke-Main
