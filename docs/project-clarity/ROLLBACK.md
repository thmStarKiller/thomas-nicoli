# Project Clarity rollback

## Preview rollback

1. Identify the exact deployment and commit:
   ```bash
   npx wrangler pages deployment list --project-name thomas-nicoli
   git log -1 --oneline
   ```
2. Keep `main` and the custom domain unchanged.
3. Rebuild the known-good production commit in a temporary worktree and deploy it to the preview branch, or delete only the failed preview deployment after recording its ID.
4. Leave the preview D1 database intact while investigating; it contains no production data. Do not drop it without explicit confirmation.
5. Confirm the preview route and headers return the expected known-good content.

## Production rollback after a future legal approval

1. Record the currently verified production deployment ID and commit before promotion.
2. If smoke checks fail, redeploy the previous known-good commit with `wrangler pages deploy` using the production branch only after an explicit production rollback decision.
3. Recheck `/es`, `/en`, `/fr`, contact, privacy, legal, headers and the custom domain.
4. Disable both Project Clarity runtime flags before investigating any queue/worker defect.
5. Preserve D1 and lead-vault evidence; never delete it as part of an application rollback.

## Dry-run verification

Before final evidence commit, the complete committed diff from `main` (`24e5b68`) to Preview HEAD (`1216ec0`) was checked in a clean temporary worktree with:

```bash
git diff --binary main...HEAD | git -C <temporary-worktree> apply --reverse --check
```

Actual result: `ROLLBACK_MAIN_TO_HEAD_DRY_RUN_OK`. The temporary worktree was removed. `npx wrangler pages deployment list --project-name thomas-nicoli` also confirmed that production deployment `11d15775…` and all Preview deployment IDs remain available.
