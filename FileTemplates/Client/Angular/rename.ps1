param (
)

$currentFolder = (Get-Item -Path "./" -Verbose).FullName

## Set Location

Set-Location $currentFolder

Get-ChildItem -r -Include "*.txt" -Exclude "*.custom.txt" | 
    ForEach-Object { 
        $a = $_.FullName;
        $b = $a -replace ".txt",".custom.txt"; 
        Copy-Item $a $b
    }