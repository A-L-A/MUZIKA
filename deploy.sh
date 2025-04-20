#!/bin/bash
# deploy.sh - Automatically update production branch from main

# Exit on any error
set -e

echo "=== MUZIKA Deployment Script ==="
echo "Updating production branch from main..."

# Make sure we have the latest code
git fetch --all
echo "✅ Fetched latest code from remote"

# Switch to main branch and pull latest changes
git checkout main
git pull origin main
echo "✅ Updated local main branch"

# Switch to production branch
git checkout production
echo "✅ Switched to production branch"

# Merge main into production
git merge main -m "Merge main into production for deployment"
echo "✅ Merged main into production"

# Push changes to remote
git push origin production
echo "✅ Pushed changes to remote production branch"

# Trigger deployment (you might need to customize this for your specific platform)
# For example, for Render you could use their API:
# curl -X POST "https://api.render.com/v1/services/YOUR_SERVICE_ID/deploys" \
#   -H "Authorization: Bearer YOUR_API_KEY"
echo "Deployment triggered. Check your deployment platform for status."

echo "=== Deployment process completed! ==="

# Optionally switch back to main branch
git checkout main
echo "Switched back to main branch"