Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Import-Module -Name (Join-Path -Path $PSScriptRoot -ChildPath "ScriptHelpers.psm1") -ErrorAction Stop

<#
.SYNOPSIS
Runs an Azure CLI command and fails on a non-zero exit code.
.PARAMETER Arguments
Azure CLI arguments excluding the leading az command.
.NOTES
Throws when Azure CLI returns a non-zero exit code.
#>
function Invoke-Az {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)] [string[]]$Arguments
    )

    & az @Arguments
    if ($LASTEXITCODE -ne 0) { throw "Azure CLI command failed with exit code $LASTEXITCODE." }
}

<#
.SYNOPSIS
Runs an Azure CLI command and parses its JSON output.
.PARAMETER Arguments
Azure CLI arguments excluding the leading az command.
.OUTPUTS
System.Object
.NOTES
Throws when Azure CLI returns a non-zero exit code or invalid JSON.
#>
function Invoke-AzJson {
    [CmdletBinding()]
    [OutputType([object])]
    param(
        [Parameter(Mandatory)] [string[]]$Arguments
    )

    $output = (& az @Arguments) -join [Environment]::NewLine
    if ($LASTEXITCODE -ne 0) { throw "Azure CLI command failed with exit code $LASTEXITCODE." }

    return ConvertFrom-Json -InputObject $output
}

<#
.SYNOPSIS
Signs into Azure when required and selects a subscription.
.PARAMETER Subscription
Subscription name or identifier to select.
.OUTPUTS
The selected Azure CLI account.
#>
function Connect-AzSubscription {
    [CmdletBinding()]
    [OutputType([pscustomobject])]
    param(
        [Parameter(Mandatory)] [string]$Subscription
    )

    try {
        $null = Invoke-AzJson -Arguments @("account", "show", "--output", "json")
    } catch {
        Write-Host -Object "Azure CLI is not logged in. Starting az login..." -ForegroundColor Yellow
        Invoke-Az -Arguments @("login", "--output", "none")
    }

    Write-Host -Object "Using Azure subscription: $Subscription" -ForegroundColor Cyan
    Invoke-Az -Arguments @("account", "set", "--subscription", $Subscription)

    $account = Invoke-AzJson -Arguments @("account", "show", "--output", "json")
    Write-Host -Object "Active subscription: $($account.name) [$($account.id)]" -ForegroundColor Cyan
    return $account
}

<#
.SYNOPSIS
Ensures that an Azure resource group exists.
.PARAMETER Name
Resource group name.
.PARAMETER Location
Azure region used when the resource group is created.
#>
function New-AzResourceGroup {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)] [string]$Name,
        [Parameter(Mandatory)] [string]$Location
    )

    Invoke-Az -Arguments @(
        "group", "create",
        "--name", $Name,
        "--location", $Location,
        "--output", "none"
    )
}

<#
.SYNOPSIS
Prints failed Azure deployment operations for a group deployment.
.PARAMETER ResourceGroupName
Name of the Azure resource group.
.PARAMETER DeploymentName
Name of the deployment to inspect.
#>
function Write-AzDeploymentFailures {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)] [string]$ResourceGroupName,
        [Parameter(Mandatory)] [string]$DeploymentName
    )

    try {
        $operations = Invoke-AzJson -Arguments @(
            "deployment", "operation", "group", "list",
            "--resource-group", $ResourceGroupName,
            "--name", $DeploymentName,
            "--output", "json"
        )
    } catch {
        Write-Host -Object "Could not read deployment operations for '$DeploymentName': $($_.Exception.Message)" -ForegroundColor Yellow
        return
    }

    $failedOperations = @($operations | Where-Object { $_.properties.provisioningState -eq "Failed" })
    if ($failedOperations.Count -eq 0) {
        Write-Host -Object "No failed deployment operations were available for '$DeploymentName'." -ForegroundColor Yellow
        return
    }

    Write-Host -Object "Failed deployment operations:" -ForegroundColor Red
    foreach ($operation in $failedOperations) {
        $targetName = $operation.properties.targetResource.resourceName
        $targetType = $operation.properties.targetResource.resourceType
        $status = $operation.properties.statusCode
        $statusMessage = $operation.properties.statusMessage
        $errorCode = $statusMessage.error.code
        $errorMessage = $statusMessage.error.message

        Write-Host -Object ""
        Write-Host -Object "Resource: $targetName" -ForegroundColor Yellow
        Write-Host -Object "Type: $targetType"
        Write-Host -Object "Status: $status"
        if (-not [string]::IsNullOrWhiteSpace($errorCode)) { Write-Host -Object "Error code: $errorCode" }
        if (-not [string]::IsNullOrWhiteSpace($errorMessage)) { Write-Host -Object "Message: $errorMessage" }
    }
}

Export-ModuleMember -Function @( "Invoke-Az", "Invoke-AzJson", "Connect-AzSubscription", "New-AzResourceGroup", "Write-AzDeploymentFailures" )
