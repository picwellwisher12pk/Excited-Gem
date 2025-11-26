---
description: Perform a full release: merge develop to master, tag, and push all
---

1. Check status
   - `git status`

2. Merge develop into master
   - `git checkout master`
   - `git merge develop`
   - **CRITICAL**: If there are conflicts:
     1. Resolve them manually or using a tool.
     2. `git add .`
     3. `git commit -m "Merge develop into master"`
     4. Ensure `git status` is clean before proceeding.

3. (Optional) Create a version tag (replace <version> with actual version, e.g., v1.0.0)
   - `git tag -a <version> -m "Release <version>"`

4. Push master and tags to remotes
   - `git push origin master --tags`
   - `git push github master --tags`

5. Switch back to develop
   - `git checkout develop`
