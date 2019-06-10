#!/bin/bash
DATE=$(date +%s)
REPO="ajaxtown/letterpad-static"
REPO_PATH="letterpad-static"
BRANCH="static-$DATE"

rm -r -f $REPO_PATH 2>/dev/null

echo "Cloning static repo" 2>&1
hub clone ajaxtown/letterpad-static 2>/dev/null
cd letterpad-static

rsync -a ../static/ ./
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
#clean up
rm -r ../static 2>/dev/null