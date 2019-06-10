#!/bin/bash
DATE=$(date +%s)
REPO_PATH="letterpad-static"
BRANCH="static-$DATE"

rm -r -f $REPO_PATH 2>/dev/null

if [-z "$GITHUB_REPO" ]; then 
    echo "Set your repository in .env file."
    exit 1;
fi

echo "Cloning repository - $GITHUB_REPO" 2>&1
hub clone $GITHUB_REPO letterpad-static 2>/dev/null
cd letterpad-static

echo "Moving static files to $GITHUB_REPO"
rsync -a ../static/ ./
if [ -z "$(git status --porcelain)" ]; then 
    # Working directory clean
    echo "No new changes found. Exiting."
else 
    # Uncommitted changes
    echo "Checking out new branch $BRANCH" 2>&1
    git checkout -b $BRANCH
    git add .
    git commit -m "[letterpad] - New changes"  2>/dev/null
    echo "Pushing to github" 2>&1
    git push -u origin $BRANCH 2>/dev/null
    echo "[Letterpad] - New changes" > prepared-message.md
    hub pull-request -c -F prepared-message.md  2>/dev/null
    git stash
    git checkout master
    git branch -D $BRANCH 
fi


#clean up
rm -r ../static 2>/dev/null