# Project Clarity local worker

Private, one-at-a-time lead analysis. It calls only `http://127.0.0.1:11434`, validates strict JSON, writes to the separate Project Clarity lead vault, and creates an unsent `.eml` draft.

## Safety boundary

- Never point `PROJECT_CLARITY_LEAD_VAULT` at the owner's personal Studio vault. The worker refuses equal or nested paths.
- Never expose Ollama or Studio through a tunnel.
- The queue bearer token stays in the local process environment and a Cloudflare secret; it is never committed.
- `PROJECT_CLARITY_SUBMISSIONS_ENABLED` and `PROJECT_CLARITY_LEGAL_APPROVED` stay false until legal approval.
- The worker creates drafts only. No SMTP or Gmail send operation exists in this code.

## Commands

```bash
npm run clarity:worker -- fixture tests/fixtures/project-clarity-submission.json
npm run clarity:worker -- once
npm run clarity:retention
npm run clarity:worker -- retention-trash
npm run clarity:worker -- retention-delete --confirm-permanent-delete
```

`retention-preview` is the default retention command and never moves or deletes files. `retention-trash` moves approved candidates to a recoverable `.trash/YYYY-MM-DD` folder. Permanent deletion requires the exact confirmation flag.
