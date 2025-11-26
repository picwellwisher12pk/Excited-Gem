---
description: Merge the current branch (usually develop) into master
---

1. Check status and ensure clean working tree
   - `git status`

2. Switch to master branch
   - `git checkout master`

3. Merge develop into master
   - `git merge develop`
   - **CRITICAL**: If there are conflicts:
     1. Resolve them manually or using a tool.
     2. `git add .`
     3. `git commit -m "Merge develop into master"`
     4. Ensure `git status` is clean before proceeding.

4. Push master to remotes
   - `git push origin master`
   - `git push github master`

5. Switch back to develop
   - `git checkout develop`
