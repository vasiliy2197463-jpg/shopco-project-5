$logos = @(
    @{ name = "versace-official.svg"; url = "https://upload.wikimedia.org/wikipedia/commons/8/82/Versace-3.svg" },
    @{ name = "zara-official.svg"; url = "https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg" },
    @{ name = "gucci-official.svg"; url = "https://upload.wikimedia.org/wikipedia/commons/4/4e/Gucci_Logo.svg" },
    @{ name = "prada-official.svg"; url = "https://upload.wikimedia.org/wikipedia/commons/e/eb/Prada-Logo.svg" },
    @{ name = "calvin-klein-official.svg"; url = "https://upload.wikimedia.org/wikipedia/commons/e/e5/Calvin_klein_logo.svg" }
)

$destDir = Join-Path $PSScriptRoot "public/images/brands"
if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Force -Path $destDir
}

$ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36"

foreach ($logo in $logos) {
    $dest = Join-Path $destDir $logo.name
    
    # Check if file already exists and is non-empty to avoid duplicate downloads
    if (Test-Path $dest) {
        $size = (Get-Item $dest).Length
        if ($size -gt 100) {
            Write-Host "[SKIP] $($logo.name) already downloaded ($size bytes)"
            continue
        }
    }
    
    Write-Host "Downloading $($logo.name) from $($logo.url)..."
    try {
        Invoke-WebRequest -UserAgent $ua -Uri $logo.url -OutFile $dest -ErrorAction Stop
        Write-Host "[SUCCESS] Downloaded $($logo.name)"
    } catch {
        Write-Error "[FAIL] Failed to download $($logo.name): $_"
    }
    
    # Add a 6-second delay between requests to bypass the Wikimedia rate limit (429)
    Write-Host "Waiting 6 seconds before next download to prevent rate limiting..."
    Start-Sleep -Seconds 6
}
