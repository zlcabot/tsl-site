/**
 * tsl-mcp — public, read-only MCP server for This Spiritual Life.
 *
 * MCP JSON-RPC 2.0 over HTTP, stateless, no auth (the corpus is public).
 * Tools: search, get_page, list_pages, open_claims, submit_answer.
 * The site is the canonical copy; this server reads its build artifacts
 * at request time so it cannot drift from what is published.
 */

interface Env {
  SITE: string
  GITHUB_REPO: string
  /** GitHub App (preferred): answers are filed by the app's own bot
   *  identity, so they are never attributed to the repository owner and
   *  the credential can only touch Issues. */
  GITHUB_APP_ID?: string
  GITHUB_APP_PRIVATE_KEY?: string
  /** Personal access token. Fallback only: issues appear under the
   *  token owner's name. */
  GITHUB_TOKEN?: string
  ANSWER_LIMIT?: { limit: (o: { key: string }) => Promise<{ success: boolean }> }
}
interface Page { slug: string; title: string; links: string[]; tags: string[]; content: string }
interface Claim { slug: string; url: string; title: string; kind: string; claim: string; fails_if: string; date: string; tags: string[] }
interface JsonRpcRequest { jsonrpc: "2.0"; id: string | number | null; method: string; params?: Record<string, unknown> }
interface ToolDef { name: string; description: string; inputSchema: { type: "object"; properties: Record<string, { type: string; description: string; default?: unknown }>; required?: string[] } }
type Handler = (args: Record<string, unknown>, env: Env, req: Request) => Promise<string>

// --- GitHub App auth ------------------------------------------------------
// A short-lived JWT signed with the app's private key buys an installation
// token, which is what actually files the issue. Cached per isolate until
// shortly before it expires.
let cachedInstallToken: { token: string; expires: number } | null = null

const b64url = (buf: ArrayBuffer | string) => {
  const bytes = typeof buf === "string" ? new TextEncoder().encode(buf) : new Uint8Array(buf)
  let s = ""
  for (const b of bytes) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

async function appJwt(env: Env): Promise<string> {
  const pem = (env.GITHUB_APP_PRIVATE_KEY ?? "").replace(/\\n/g, "\n")
  const der = Uint8Array.from(
    atob(pem.replace(/-----(BEGIN|END) [^-]+-----/g, "").replace(/\s+/g, "")),
    (c) => c.charCodeAt(0),
  )
  const key = await crypto.subtle.importKey("pkcs8", der, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"])
  const now = Math.floor(Date.now() / 1000)
  const head = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))
  const body = b64url(JSON.stringify({ iat: now - 60, exp: now + 540, iss: env.GITHUB_APP_ID }))
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(`${head}.${body}`))
  return `${head}.${body}.${b64url(sig)}`
}

/** Token for filing an issue, and the identity it will carry. */
async function githubAuth(env: Env): Promise<{ token: string; as: "app" | "pat" } | null> {
  if (env.GITHUB_APP_ID && env.GITHUB_APP_PRIVATE_KEY) {
    const now = Math.floor(Date.now() / 1000)
    if (cachedInstallToken && cachedInstallToken.expires > now + 60) return { token: cachedInstallToken.token, as: "app" }
    const jwt = await appJwt(env)
    const gh = { Accept: "application/vnd.github+json", "User-Agent": "tsl-mcp", Authorization: `Bearer ${jwt}` }
    const [owner, repo] = env.GITHUB_REPO.split("/")
    const inst = await fetch(`https://api.github.com/repos/${owner}/${repo}/installation`, { headers: gh })
    if (inst.ok) {
      const { id } = (await inst.json()) as { id: number }
      const tok = await fetch(`https://api.github.com/app/installations/${id}/access_tokens`, { method: "POST", headers: gh })
      if (tok.ok) {
        const { token, expires_at } = (await tok.json()) as { token: string; expires_at: string }
        cachedInstallToken = { token, expires: Math.floor(new Date(expires_at).getTime() / 1000) }
        return { token, as: "app" }
      }
    }
    // fall through to the PAT rather than dropping the answer
  }
  return env.GITHUB_TOKEN ? { token: env.GITHUB_TOKEN, as: "pat" } : null
}

const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization" }
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", ...CORS } })
const ok = (id: JsonRpcRequest["id"], result: unknown) => json({ jsonrpc: "2.0", id, result })
const rpcErr = (id: JsonRpcRequest["id"], code: number, message: string) => json({ jsonrpc: "2.0", id, error: { code, message } })
const str = (a: Record<string, unknown>, k: string, d = "") => String(a[k] ?? d)
const num = (a: Record<string, unknown>, k: string, d: number, lo: number, hi: number) => { const v = Number(a[k] ?? d); return Math.max(lo, Math.min(hi, isNaN(v) ? d : v)) }

async function fetchIndex(env: Env): Promise<Page[]> {
  const res = await fetch(`${env.SITE}/static/contentIndex.json`, { cf: { cacheTtl: 300 } } as RequestInit)
  if (!res.ok) throw new Error(`contentIndex ${res.status}`)
  const raw = (await res.json()) as Record<string, Page>
  return Object.values(raw).filter((p) => p.slug && !p.slug.startsWith("tags/"))
}
async function fetchClaims(env: Env): Promise<{ claims: Claim[]; answer_route: string } | null> {
  const res = await fetch(`${env.SITE}/static/claims.json`, { cf: { cacheTtl: 300 } } as RequestInit)
  if (!res.ok) return null
  return (await res.json()) as { claims: Claim[]; answer_route: string }
}
const urlOf = (env: Env, slug: string) => `${env.SITE}/${slug.replace(/\/index$/, "/")}`
const kindOf = (slug: string) => slug.startsWith("terms/") ? "term" : slug.startsWith("essays/") ? "essay" : slug.startsWith("wiki/") ? "wiki" : slug.startsWith("skills/") ? "skill" : "page"

function snippet(text: string, terms: string[], width = 240): string {
  const lower = text.toLowerCase()
  let at = -1
  for (const t of terms) { const i = lower.indexOf(t); if (i >= 0 && (at < 0 || i < at)) at = i }
  if (at < 0) return text.slice(0, width).trim() + "…"
  const start = Math.max(0, at - Math.floor(width / 3))
  return (start > 0 ? "…" : "") + text.slice(start, start + width).trim() + "…"
}

const tools: { def: ToolDef; handler: Handler }[] = [
  {
    def: {
      name: "search",
      description: "Full-text search across everything published on thisspirituallife.com (essays, terms, wiki, skills). Returns slug, title, URL, tags, and a snippet. Use get_page for the full text.",
      inputSchema: { type: "object", properties: { query: { type: "string", description: "Words to look for" }, limit: { type: "number", description: "Max results (1–20)", default: 8 } }, required: ["query"] },
    },
    handler: async (args, env) => {
      const q = str(args, "query").trim()
      if (!q) return "ERROR: query is required"
      const limit = num(args, "limit", 8, 1, 20)
      const terms = q.toLowerCase().split(/\s+/).filter((t) => t.length > 1)
      const pages = await fetchIndex(env)
      const scored = pages.map((p) => {
        const title = p.title.toLowerCase(), body = p.content.toLowerCase()
        let score = 0
        for (const t of terms) {
          if (title.includes(t)) score += 10
          const n = body.split(t).length - 1
          score += Math.min(n, 20)
        }
        return { p, score }
      }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score).slice(0, limit)
      if (!scored.length) return `No results for "${q}".`
      return scored.map(({ p }) => `${p.title}\n  ${urlOf(env, p.slug)}\n  kind: ${kindOf(p.slug)}  tags: ${(p.tags || []).join(", ") || "—"}\n  ${snippet(p.content, terms)}`).join("\n\n")
    },
  },
  {
    def: {
      name: "get_page",
      description: "Return a published page by slug (e.g. 'terms/tending', 'essays/what-is-time', 'skills/death-exemption-skill'): title, URL, tags, outgoing links, and the full text. Essays also return their claim, kind, and fails_if.",
      inputSchema: { type: "object", properties: { slug: { type: "string", description: "Page slug without leading slash" } }, required: ["slug"] },
    },
    handler: async (args, env) => {
      const slug = str(args, "slug").replace(/^\/+|\/+$/g, "")
      const pages = await fetchIndex(env)
      const p = pages.find((x) => x.slug === slug) ?? pages.find((x) => x.slug.endsWith("/" + slug))
      if (!p) return `Not found: ${slug}. Try search, or list_pages.`
      const head = [`# ${p.title}`, `URL: ${urlOf(env, p.slug)}`, `kind: ${kindOf(p.slug)}`, `tags: ${(p.tags || []).join(", ") || "—"}`, `links: ${(p.links || []).join(", ") || "—"}`]
      if (kindOf(p.slug) === "essay") {
        const c = (await fetchClaims(env))?.claims.find((x) => x.slug === p.slug)
        if (c) head.push(`claim-kind: ${c.kind}`, `claim: ${c.claim}`, `fails_if: ${c.fails_if}`)
      }
      return head.join("\n") + "\n\n" + p.content.slice(0, 60000)
    },
  },
  {
    def: {
      name: "list_pages",
      description: "List published pages, optionally filtered by kind (term, essay, wiki, skill, page) and/or tag (a topic like 'mortality' or a field like 'science/physics').",
      inputSchema: { type: "object", properties: { kind: { type: "string", description: "term | essay | wiki | skill | page | all", default: "all" }, tag: { type: "string", description: "Topic or field tag to filter by", default: "" } } },
    },
    handler: async (args, env) => {
      const kind = str(args, "kind", "all"), tag = str(args, "tag", "").trim()
      const pages = (await fetchIndex(env)).filter((p) => (kind === "all" || kindOf(p.slug) === kind) && (!tag || (p.tags || []).includes(tag)))
      if (!pages.length) return "No pages match."
      return pages.sort((a, b) => a.slug.localeCompare(b.slug)).map((p) => `${p.slug}  —  ${p.title}  [${kindOf(p.slug)}; ${(p.tags || []).join(", ") || "no tags"}]`).join("\n")
    },
  },
  {
    def: {
      name: "open_claims",
      description: "The site's open claims: every published essay's one-sentence claim, its kind (rereading | bet | pointing), and fails_if, the result that would show it wrong. These are the checks the work asks a reader to run. Results, especially failures, go to submit_answer or to the channels at /answer.",
      inputSchema: { type: "object", properties: {} },
    },
    handler: async (_args, env) => {
      const feed = await fetchClaims(env)
      if (!feed) return "The claims feed is not available yet; see https://thisspirituallife.com/answer"
      return `${feed.claims.length} open claim(s). Answer at ${feed.answer_route}\n\n` + feed.claims.map((c) => `${c.title}\n  ${c.url}\n  kind: ${c.kind}\n  claim: ${c.claim}\n  fails if: ${c.fails_if}`).join("\n\n")
    },
  },
  {
    def: {
      name: "submit_answer",
      description: "Send an answer to a published essay: a check, an extension, a refusal with reasons, or a result from running its claim on your own ground. Failures are the answers most wanted. Opens a public, attributed issue on the site's repository for the author to read; the ones that change something are published with a reply. Minimum 200 characters. Say what you ran.",
      inputSchema: {
        type: "object",
        properties: {
          essay_url: { type: "string", description: "URL of the essay being answered, e.g. https://thisspirituallife.com/essays/what-is-time" },
          answer: { type: "string", description: "The answer itself (≥ 200 characters). Cite the heading anchor the objection lands on." },
          name: { type: "string", description: "Who is answering (person, or person-and-model)", default: "" },
          contact: { type: "string", description: "How the author can reply (optional)", default: "" },
          ran: { type: "string", description: "What was run, on what data or ground (optional)", default: "" },
        },
        required: ["essay_url", "answer"],
      },
    },
    handler: async (args, env, req) => {
      const essay = str(args, "essay_url").trim(), answer = str(args, "answer").trim()
      if (!essay.startsWith(env.SITE)) return `ERROR: essay_url must be a page on ${env.SITE}`
      if (answer.length < 200) return "ERROR: an answer is at least 200 characters; say what you checked and what you found"
      if (env.ANSWER_LIMIT) {
        const ip = req.headers.get("cf-connecting-ip") ?? "anon"
        const { success } = await env.ANSWER_LIMIT.limit({ key: ip })
        if (!success) return "Rate limited: five answers a minute. Try again shortly, or use the channels at /answer."
      }
      const auth = await githubAuth(env)
      if (!auth) return `This channel is not open yet. Answer through ${env.SITE}/answer, or file directly at https://github.com/${env.GITHUB_REPO}/issues.`
      const slug = essay.replace(env.SITE + "/", "")
      const body = [`**Essay:** ${essay}`, `**From:** ${str(args, "name") || "(not given)"}`, `**Contact:** ${str(args, "contact") || "(not given)"}`, `**Ran:** ${str(args, "ran") || "(not given)"}`, "", "---", "", answer, "", "---", `_Filed through the TSL MCP server's submit_answer tool by the sender named above. This is a submission, not the site author's writing.${auth.as === "pat" ? " (Filed under the repository owner's account for want of a bot identity.)" : ""} A first pass sorts the log; what it brings forward appears at ${env.SITE}/answers. See ${env.SITE}/answer._`].join("\n")
      const res = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/issues`, {
        method: "POST",
        headers: { Authorization: `Bearer ${auth.token}`, Accept: "application/vnd.github+json", "User-Agent": "tsl-mcp", "Content-Type": "application/json" },
        body: JSON.stringify({ title: `Answer: ${slug}`, body, labels: ["answer"] }),
      })
      if (!res.ok) return `Could not file the answer (GitHub ${res.status}). Use the channels at ${env.SITE}/answer.`
      const issue = (await res.json()) as { html_url: string }
      return `Filed. Your answer is public at ${issue.html_url} and will be read. Thank you.`
    },
  },
]

async function handleMcp(req: Request, env: Env): Promise<Response> {
  let body: JsonRpcRequest
  try { body = (await req.json()) as JsonRpcRequest } catch { return rpcErr(null, -32700, "Parse error") }
  const { id, method, params = {} } = body
  switch (method) {
    case "initialize": return ok(id, { protocolVersion: "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "tsl-mcp", version: "1.0.0" } })
    case "notifications/initialized": return new Response(null, { status: 204, headers: CORS })
    case "tools/list": return ok(id, { tools: tools.map((t) => t.def) })
    case "tools/call": {
      const name = str(params as Record<string, unknown>, "name")
      const args = ((params as Record<string, unknown>).arguments ?? {}) as Record<string, unknown>
      const tool = tools.find((t) => t.def.name === name)
      if (!tool) return rpcErr(id, -32601, `Unknown tool: ${name}`)
      try { return ok(id, { content: [{ type: "text", text: await tool.handler(args, env, req) }] }) } catch (e) { return rpcErr(id, -32603, `Tool error: ${e}`) }
    }
    case "ping": return ok(id, {})
    default: return rpcErr(id, -32601, `Method not found: ${method}`)
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS })
    if (request.method === "GET" && url.pathname === "/health") return json({ status: "ok", name: "tsl-mcp", version: "1.0.0" })
    if (request.method === "GET") return json({
      name: "tsl-mcp", description: "Public, read-only MCP server for This Spiritual Life (thisspirituallife.com). POST MCP JSON-RPC to this URL.",
      tools: tools.map((t) => ({ name: t.def.name, description: t.def.description })), answer: `${env.SITE}/answer`, ai: `${env.SITE}/ai`, cite: `${env.SITE}/citing`,
    })
    if (request.method === "POST") return handleMcp(request, env)
    return json({ error: "Method not allowed" }, 405)
  },
} satisfies ExportedHandler<Env>
