# XYLO AI - GitHub Automation Script
# Usage: .\push_to_github.ps1 -RepoUrl "https://github.com/user/repo.git"

param (
    [Parameter(Mandatory=$true)]
    [string]$RepoUrl
)

Write-Host "🚀 Preparing to push XYLO AI to GitHub..." -ForegroundColor Cyan

# Check if git is initialized
if (!(Test-Path .git)) {
    Write-Host "📂 Initializing Git repository..."
    git init
}

# Add all files
Write-Host "📦 Staging files..."
git add .

# Commit
$commitMsg = "Final: XYLO AI Invoice System with Premium UI & Pitch Deck"
Write-Host "💾 Committing changes: $commitMsg"
git commit -m $commitMsg

# Add remote
Write-Host "🔗 Connecting to remote: $RepoUrl"
git remote remove origin 2>$null
git remote add origin $RepoUrl

# Push
Write-Host "⬆️ Pushing to GitHub (master)..."
git push -u origin master --force

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "🔗 View your code at: $RepoUrl" -ForegroundColor Cyan
} else {
    Write-Host "❌ Push failed. Please check your credentials or Repo URL." -ForegroundColor Red
}
