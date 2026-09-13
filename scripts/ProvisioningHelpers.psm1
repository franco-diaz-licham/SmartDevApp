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


Export-ModuleMember -Function @( "Invoke-Az", "Invoke-AzJson", "Connect-AzSubscription", "New-AzResourceGroup" )
