Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

<#
.SYNOPSIS
Loads key-value pairs from a dotenv file into the current process environment.

.DESCRIPTION
Reads non-empty, non-comment lines in NAME=VALUE format and exposes each value
through process-scoped environment variables for the rest of the script.

.PARAMETER Path
Path to the dotenv file to load.

.NOTES
Throws when the dotenv file does not exist or contains a malformed line.
#>
function Import-DotEnv {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)] [string]$Path
    )

    if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) { throw ".env file was not found: $Path" }

    foreach ($sourceLine in Get-Content -LiteralPath $Path) {
        $line = $sourceLine.Trim()
        $lineIgnored = [string]::IsNullOrWhiteSpace($line) -or $line.StartsWith("#")
        if ($lineIgnored) { continue }

        $separatorIndex = $line.IndexOf("=")
        if ($separatorIndex -le 0) { throw "Invalid .env entry. Expected NAME=VALUE." }

        $name = $line.Substring(0, $separatorIndex).Trim()
        $value = $line.Substring($separatorIndex + 1).Trim().Trim('"').Trim("'")
        [Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
}

<#
.SYNOPSIS
Reads a required configuration value from the current process environment.

.PARAMETER Name
Environment variable name to read.

.OUTPUTS
System.String

.NOTES
Throws when the environment variable is missing or blank.
#>
function Get-Config {
    [CmdletBinding()]
    [OutputType([string])]
    param(
        [Parameter(Mandatory)] [string]$Name
    )

    $value = [Environment]::GetEnvironmentVariable($Name, "Process")
    if ([string]::IsNullOrWhiteSpace($value)) { throw "$Name is required. Set it in the repository-root .env file." }

    return $value
}

<#
.SYNOPSIS
Reads an optional configuration value from the current process environment.

.PARAMETER Name
Environment variable name to read.

.PARAMETER DefaultValue
Value returned when the environment variable is missing or blank.

.OUTPUTS
System.String
#>
function Get-OptionalConfig {
    [CmdletBinding()]
    [OutputType([string])]
    param(
        [Parameter(Mandatory)] [string]$Name,
        [string]$DefaultValue = ""
    )

    $value = [Environment]::GetEnvironmentVariable($Name, "Process")
    if ([string]::IsNullOrWhiteSpace($value)) { return $DefaultValue }

    return $value
}

<#
.SYNOPSIS
Resolves a file path relative to the repository root.

.PARAMETER Path
Absolute path or repository-relative path.

.PARAMETER RepoRoot
Absolute path to the repository root.

.OUTPUTS
System.String

.NOTES
Throws when the path cannot be resolved.
#>
function Resolve-RepoPath {
    [CmdletBinding()]
    [OutputType([string])]
    param(
        [Parameter(Mandatory)] [string]$Path,
        [Parameter(Mandatory)] [string]$RepoRoot
    )

    $pathIsRooted = [IO.Path]::IsPathRooted($Path)
    if ($pathIsRooted) { return (Resolve-Path -LiteralPath $Path).Path }

    $absolutePath = Join-Path -Path $RepoRoot -ChildPath $Path
    return (Resolve-Path -LiteralPath $absolutePath).Path
}

<#
.SYNOPSIS
Checks whether an external command is available.

.PARAMETER Name
Command name to resolve.

.OUTPUTS
System.Boolean
#>
function Test-CommandAvailable {
    [CmdletBinding()]
    [OutputType([bool])]
    param(
        [Parameter(Mandatory)] [string]$Name
    )

    $command = Get-Command -Name $Name -ErrorAction SilentlyContinue
    return $null -ne $command
}

<#
.SYNOPSIS
Writes an object as UTF-8 JSON.

.PARAMETER Value
Object to serialize.

.PARAMETER Path
Destination file path.

.PARAMETER Depth
Maximum serialization depth.
#>
function Write-JsonFile {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)] [object]$Value,
        [Parameter(Mandatory)] [string]$Path,
        [ValidateRange(1, 100)] [int]$Depth = 20
    )

    $json = ConvertTo-Json -InputObject $Value -Depth $Depth
    Set-Content -LiteralPath $Path -Value $json -Encoding utf8NoBOM
}

Export-ModuleMember -Function @(
    "Get-Config",
    "Get-OptionalConfig",
    "Import-DotEnv",
    "Resolve-RepoPath",
    "Test-CommandAvailable",
    "Write-JsonFile"
)
