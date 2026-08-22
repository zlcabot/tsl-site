# tsl-mcp

Public, read-only MCP server for This Spiritual Life.

- **Endpoint:** `https://thisspirituallife.com/mcp` (Netlify proxies it to the
  Worker; the `workers.dev` hostname is deliberately never advertised).
- **Auth:** none. The corpus is public.
- **Tools:** `search`, `get_page`, `list_pages`, `open_claims`, `submit_answer`.
- **Data:** read from the deployed site at request time
  (`/static/contentIndex.json`, `/static/claims.json`), so the server cannot
  drift from what is published.

Deploy: `npx wrangler deploy`. Typecheck: `npx tsc`.

## Who files an answer

`submit_answer` opens a GitHub issue on `zlcabot/tsl-site` labelled `answer`.
The identity that files it is whatever credential the Worker holds, and this
matters: an answer is somebody else's words, and it must not appear to be the
site author's.

**Preferred — a GitHub App.** Answers are filed by the app's own bot identity
(`tsl-answers[bot]`), the credential can only touch Issues on the one repo, and
no second human account is needed. Set up once:

1. <https://github.com/settings/apps/new>
2. **Name:** `tsl-answers` (must be unique across GitHub).
   **Homepage URL:** `https://thisspirituallife.com`.
3. **Webhook:** untick **Active**. None is needed.
4. **Repository permissions → Issues: Read and write.** Nothing else.
5. **Where can this be installed:** only on this account.
6. Create it, then note the **App ID**.
7. **Generate a private key.** A `.pem` downloads.
8. **Install App** → only select repositories → `tsl-site`.
9. Give the Worker the credentials, from this directory:

   ```bash
   echo <APP_ID> | npx wrangler secret put GITHUB_APP_ID
   cat ~/Downloads/tsl-answers.*.private-key.pem | npx wrangler secret put GITHUB_APP_PRIVATE_KEY
   npx wrangler deploy
   ```

10. Delete the `.pem` from Downloads; the Worker has it now.
11. Retire the fallback: `npx wrangler secret delete GITHUB_TOKEN`.

The Worker signs a short-lived JWT with the private key, exchanges it for an
installation token, and caches that token per isolate. If the app credentials
are absent or the exchange fails, it falls back to `GITHUB_TOKEN` rather than
dropping the answer, and the filed issue says so in its footer.

**Fallback — a personal access token.** `GITHUB_TOKEN`, used only if no app is
configured. Issues then appear under the token owner's account, which is wrong
for answers; the footer notes it. If this is the only option, use a
fine-grained token scoped to Issues on `tsl-site` alone, never a classic
`repo`-scope token.
