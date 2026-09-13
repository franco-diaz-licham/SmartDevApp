#!/usr/bin/env pwsh

<#
.SYNOPSIS
Deletes the SmartDevApp Azure infrastructure resource group.

.DESCRIPTION
Reads the target subscription and resource group from the repository-root .env file,
requires typed confirmation, and waits for Azure to complete the deletion.

.EXAMPLE
./scripts/deprovision-infra.ps1
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
    $envFile = Join-Path -Path $repoRoot -ChildPath ".env"
    Import-DotEnv -Path $envFile

    # Variables
    $subscriptionName = Get-Config -Name "AZURE_SUBSCRIPTION"
    $resourceGroupName = Get-Config -Name "AZURE_RESOURCE_GROUP_NAME"
    $deleteArguments = @(
        "group", "delete"
        "--name", $resourceGroupName
        "--yes"
    )
    $azureCliAvailable = Test-CommandAvailable -Name "az"

    # Validation
    if (-not $azureCliAvailable) { throw "Azure CLI was not found. Install it, then run this script again." }

    # Resource-group discovery
    $null = Connect-AzSubscription -Subscription $subscriptionName
    Write-Host -Object "Target resource group: $resourceGroupName" -ForegroundColor Yellow

    $resourceGroupExists = Test-AzResourceGroupExists -ResourceGroupName $resourceGroupName
    if (-not $resourceGroupExists) {
        Write-Host -Object "Resource group does not exist. Nothing to delete." -ForegroundColor Green
        return
    }

    # Resource-group confirmation
    Show-AzResourceGroupResources -ResourceGroupName $resourceGroupName
    $deletionConfirmed = Confirm-AzResourceGroupDeletion -ResourceGroupName $resourceGroupName
    if (-not $deletionConfirmed) {
        Write-Host -Object "Confirmation did not match. No resources were deleted." -ForegroundColor Yellow
        return
    }

    # Resource-group deletion
    Write-Host -Object ""
    Write-Host -Object "Deleting resource group: $resourceGroupName" -ForegroundColor Cyan
    Invoke-Az -Arguments $deleteArguments
    Write-Host -Object "Resource group deleted." -ForegroundColor Green
}

<#
.SYNOPSIS
Checks whether an Azure resource group exists.

.PARAMETER ResourceGroupName
Name of the Azure resource group.

.OUTPUTS
System.Boolean
#>
function Test-AzResourceGroupExists {
    [CmdletBinding()]
    [OutputType([bool])]
    param(
        [Parameter(Mandatory)] [string]$ResourceGroupName
    )

    return Invoke-AzJson -Arguments @(
        "group", "exists"
        "--name", $ResourceGroupName
        "--output", "json"
    )
}

<#
.SYNOPSIS
Displays the resources contained in an Azure resource group.

.PARAMETER ResourceGroupName
Name of the Azure resource group.
#>
function Show-AzResourceGroupResources {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)] [string]$ResourceGroupName
    )

    Write-Host -Object ""
    Write-Host -Object "Resources that will be deleted:" -ForegroundColor Yellow
    Invoke-Az -Arguments @(
        "resource", "list"
        "--resource-group", $ResourceGroupName
        "--query", "[].{Name:name, Type:type, Location:location}"
        "--output", "table"
    )
}

<#
.SYNOPSIS
Requires the operator to type the target resource-group name before deletion.

.PARAMETER ResourceGroupName
Name that must be entered exactly to confirm deletion.

.OUTPUTS
System.Boolean
#>
function Confirm-AzResourceGroupDeletion {
    [CmdletBinding()]
    [OutputType([bool])]
    param(
        [Parameter(Mandatory)] [string]$ResourceGroupName
    )

    Write-Host -Object ""
    Write-Host -Object "This will delete the entire resource group and every resource inside it." -ForegroundColor Red
    $confirmation = Read-Host -Prompt "Type '$ResourceGroupName' to confirm"
    return $confirmation -eq $ResourceGroupName
}

Invoke-Main
