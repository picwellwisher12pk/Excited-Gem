---
description: Merge the current branch into a release branch
---

1. Check status
   - `git status`

2. List available release branches to choose from
   - `git branch --list "release/*"`

3. Switch to the target release branch (replace <release-branch> with actual name)
   - `git checkout <release-branch>`

4. Merge develop into the release branch
   - `git merge develop`
   - **CRITICAL**: If there are conflicts:
     1. Resolve them manually or using a tool.
     2. `git add .`
     3. `git commit -m "Merge develop into release branch"`
     4. Ensure `git status` is clean before proceeding.

5. Push release branch to remotes
   - `git push origin <release-branch>`
   - `git push github <release-branch>`

6. Switch back to develop
   - `git checkout develop`
