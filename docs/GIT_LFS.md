# Git LFS Guide — DynastiLife

This document explains how to set up Git LFS (Large File Storage) for the project, how to track the `assets/portraits` folder, and safe options to migrate files that have already been committed. Commands below are written for Windows PowerShell.

WARNING: Some migration steps rewrite Git history (force-push). If you're working with collaborators, coordinate first and make a backup of the repo.

## 1) Install Git LFS (one-time)

If you already have `git lfs` installed, skip this step.

PowerShell (Chocolatey):

```powershell
choco install git-lfs -y
```

Or download and run the installer from https://git-lfs.github.com/ and follow the GUI steps.

After installing, run:

```powershell
git lfs install
```

## 2) Track portrait files with LFS

Tell Git LFS which paths to manage. Typical patterns:

```powershell
# from repo root
Set-Location -Path 'd:\Project\Application\DynastiLife'

git lfs track "assets/portraits/*"
# This writes patterns into .gitattributes
```

Stage and commit the `.gitattributes` file:

```powershell
git add .gitattributes
git commit -m "chore: track portraits with Git LFS"
```

## 3) If portraits are NOT yet committed (fresh files)

If you added the files locally but haven't committed them, a normal `git add` + `git commit` will place them under LFS because of the tracking rule:

```powershell
git add assets/portraits
git commit -m "feat: add portrait assets via LFS"
git push origin <your-branch>
```

## 4) If portraits ARE already committed (safe, non-history rewrite migration)

This is the recommended safe approach for most teams. It does not rewrite history.

1. Ensure your working tree is clean (commit or stash changes).
2. Remove the files from the index (but keep them on disk), commit that removal, then re-add them so LFS stores them:

```powershell
# remove from index only (not deleting files from disk)
git rm --cached -r assets/portraits

git commit -m "chore: remove portraits from index so LFS can re-add them"

# re-add so LFS will handle them now
git add assets/portraits
git commit -m "chore: add portraits via Git LFS"

# push normally
git push origin <your-branch>
```

This will result in the files being stored in LFS going forward; the old objects remain in earlier commits in normal Git history (they are not removed from remote history unless you rewrite history).

## 5) If you want to REMOVE large files from *history* (advanced; rewrites history)

If you want to completely remove large blobs from the past commits to shrink repo size on remote, you must rewrite history. This is disruptive and requires force-pushing and coordination.

Example with `git lfs migrate` (recommended tool for this):

```powershell
# WARNING: this rewrites history. Make a backup! Ensure all collaborators know to reclone.
git lfs migrate import --include="assets/portraits/*"

# After migration, force push the rewritten history
git push --force
```

Notes:
- Everyone who clones/pulls after this must re-clone or run commands to realign their local repos.
- Use this only if you need to reduce remote repo size and you're prepared to coordinate.

## 6) Verify LFS tracking & uploaded files

List LFS-tracked files in your local repo:

```powershell
git lfs ls-files
```

Check that `.gitattributes` contains the track pattern:

```powershell
Get-Content .gitattributes
```

## 7) Git LFS storage limits and hosting

- Git hosting providers (GitHub, GitLab) often apply bandwidth and storage quotas for LFS. Check your remote's LFS policy and consider a paid plan if you host many large binary assets.
- Alternatively, host large art files on a CDN or object store (S3, Cloudflare R2) and keep only a manifest in the repo.

## 8) Adding an index for React Native bundling (optional, recommended)

React Native requires `require('./path/to/image.png')` to use a static path at compile/bundle-time. If you plan to bundle portraits into the app, generate a TypeScript module mapping portrait IDs to `require` calls.

Example script outline (Node.js):

- Read files under `assets/portraits/*`
- Write `assets/portraits/portraitIndex.ts` with exports like:

```ts
export default {
  'female_001': require('./female/female_001.png'),
  'male_001': require('./male/male_001.png'),
}
```

This makes runtime lookups trivial: `import portraits from '../assets/portraits/portraitIndex'; <Image source={portraits[portraitId]} />`.

## 9) Common gotchas and tips

- If you track patterns incorrectly, files may still be committed to Git history. Use `git lfs ls-files` to confirm which files are in LFS.
- If you use CI, ensure the CI environment has `git lfs` installed so LFS files are fetched correctly.
- When collaborating, commit `.gitattributes` early so teammates' future commits are placed in LFS.

---

If you want, I can:
- Run the safe `git rm --cached -r assets/portraits` steps for you now (I will not rewrite history). Or,
- Run the `git lfs migrate import --include="assets/portraits/*"` rewrite if you confirm you understand the force-push implications.

Which would you like me to do?