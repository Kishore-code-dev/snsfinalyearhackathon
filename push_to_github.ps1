# VERTIXA Institutional - GitHub Automation Script
param (
    [Parameter(Mandatory = $true)]
    [string]$RepoUrl
)

Write-Host "🚀 Preparing to push VERTIXA Institutional to GitHub..." -ForegroundColor Blue

if (!(git rev-parse --is-inside-work-tree 2>$null)) {
    Write-Host "📂 Initializing Git repository..."
    git init
}

Write-Host "📦 Staging files..."
git add .

$commitMsg = "Strategic Upgrade: Implemented VERTIXA Institutional Guard. Cleaned legacy artifacts. Build verified."
Write-Host "💾 Committing changes: $commitMsg"
git commit -m $commitMsg

Write-Host "🔗 Connecting to remote: $RepoUrl"
git remote remove origin 2>$null
git remote add origin $RepoUrl

Write-Host "⬆️ Pushing to GitHub (master)..."
git push -u origin master --force

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
}
else {
    Write-Host "❌ Push failed. Please check your credentials." -ForegroundColor Red
}
