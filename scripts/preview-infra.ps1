#!/usr/bin/env pwsh

<#
.SYNOPSIS
Validates and previews the SmartDevApp Azure infrastructure with Bicep.
.DESCRIPTION
Reads configuration from the repository-root .env. Local deployment inputs are
merged into a temporary parameter file and removed in finally.
The target resource group must already exist. This script never creates resources.
.EXAMPLE
./scripts/preview-infra.ps1
#>
[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Import-Module -Name (Join-Path -Path $PSScriptRoot -ChildPath "ScriptHelpers.psm1") -Force
Import-Module -Name (Join-Path -Path $PSScriptRoot -ChildPath "ProvisioningHelpers.psm1") -Force

function Invoke-Main {
    [CmdletBinding()]
    param()

    # Environment
    $repoRoot = Split-Path -Path $PSScriptRoot -Parent
    Import-DotEnv -Path (Join-Path -Path $repoRoot -ChildPath ".env")

    # Variables
    $subscriptionName = Get-Config -Name "AZURE_SUBSCRIPTION"
    $resourceGroupName = Get-Config -Name "AZURE_RESOURCE_GROUP_NAME"
    $resourceGroupLocation = Get-Config -Name "AZURE_RESOURCE_GROUP_LOCATION"
    $deploymentName = Get-Config -Name "AZURE_DEPLOYMENT_NAME"
    $templatePath = Resolve-RepoPath -Path (Get-Config -Name "AZURE_TEMPLATE_FILE") -RepoRoot $repoRoot
    $parametersPath = Resolve-RepoPath -Path (Get-Config -Name "AZURE_PARAMETERS_FILE") -RepoRoot $repoRoot
    $temporaryParametersFile = Join-Path -Path ([IO.Path]::GetTempPath()) -ChildPath "smartdevapp.$([guid]::NewGuid()).parameters.json"
    $parameters = Get-Content -LiteralPath $parametersPath -Raw | ConvertFrom-Json -AsHashtable
    $parameters.parameters["apiEntraTenantId"] = @{ value = Get-Config -Name "API_ENTRA_TENANT_ID" }
    $parameters.parameters["apiEntraAudience"] = @{ value = Get-Config -Name "API_ENTRA_AUDIENCE" }
    $parameters.parameters["apiEntraOwnerObjectId"] = @{ value = Get-Config -Name "API_ENTRA_OWNER_OBJECT_ID" }
    $parameters.parameters["frontendEntraClientId"] = @{ value = Get-Config -Name "FRONTEND_ENTRA_CLIENT_ID" }
    $parameters.parameters["frontendEntraAuthority"] = @{ value = Get-Config -Name "FRONTEND_ENTRA_AUTHORITY" }
    $parameters.parameters["frontendEntraApiScope"] = @{ value = Get-Config -Name "FRONTEND_ENTRA_API_SCOPE" }

    $senderAddress = Get-OptionalConfig -Name "COMMUNICATION_SENDER_ADDRESS"
    if (-not [string]::IsNullOrWhiteSpace($senderAddress)) { $parameters.parameters["communicationSenderAddress"] = @{ value = $senderAddress } }
    if (-not (Test-CommandAvailable -Name "az")) { throw "Azure CLI was not found. Install it and retry." }

    try {
        Write-JsonFile -Value $parameters -Path $temporaryParametersFile
        $null = Connect-AzSubscription -Subscription $subscriptionName
        $deploymentArguments = @(
            "deployment", "group", "validate",
            "--name", $deploymentName,
            "--resource-group", $resourceGroupName,
            "--template-file", $templatePath,
            "--parameters", "@$temporaryParametersFile",
            "--output", "json"
        )
        $deployment = Invoke-AzJson -Arguments $deploymentArguments
        $deploymentArguments[2] = "what-if"
        Invoke-Az -Arguments $deploymentArguments
        Write-Host -Object "Validation and preview complete. No resources were created." -ForegroundColor Green
    } finally {
        if (Test-Path -LiteralPath $temporaryParametersFile) { Remove-Item -LiteralPath $temporaryParametersFile -Force }
        $parameters = $null
    }
}

Invoke-Main
