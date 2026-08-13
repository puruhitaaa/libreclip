# LibreClip MCP Server

A [Model Context Protocol](https://modelcontextprotocol.io) server for
[LibreClip](https://libreclip.com) — turn long-form videos (YouTube links or
direct URLs) into short, vertical, subtitled viral clips from any MCP client
(Claude Desktop, Claude Code, Cursor, etc.).

By default it talks to the **official hosted LibreClip API** at
`https://api.libreclip.com`. Point it at your own deployment by setting
`LIBRECLIP_API_URL`.

## What it can do

| Tool | Auth | Description |
|------|:----:|-------------|
| `libreclip_health` | – | API status + how this server is configured |
| `libreclip_list_caption_templates` | – | Available caption styles (default, hormozi, mrbeast, …) |
| `libreclip_list_transitions` | – | Available transition effects |
| `libreclip_broll_status` | – | Whether B-roll overlays are configured |
| `libreclip_list_fonts` | ✓ | Subtitle fonts available to your account |
| `libreclip_billing_summary` | ✓ | Plan, usage and remaining quota |
| `libreclip_create_clip_task` | ✓ | Start clipping a video → returns a `task_id` |
| `libreclip_list_tasks` | ✓ | List your tasks |
| `libreclip_get_task` | ✓ | Task status, progress and clips |
| `libreclip_wait_for_task` | ✓ | Poll until a task finishes |
| `libreclip_list_clips` | ✓ | List a task's generated clips |
| `libreclip_download_clip` | ✓ | Save a clip's MP4 to disk |
| `libreclip_export_clip` | ✓ | Re-encode + save with a platform preset (tiktok/reels/shorts) |
| `libreclip_cancel_task` / `libreclip_resume_task` / `libreclip_delete_task` | ✓ | Manage tasks |

Tools marked ✓ require an API key (or self-host credentials, see below).

## Getting an API key

1. Sign in at [libreclip.com](https://libreclip.com).
2. Go to **Settings → API Keys**.
3. Create a key and copy it (it's shown only once). It looks like `sk_…`.

## Configuration

All configuration is via environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `LIBRECLIP_API_KEY` | – | Your API key (recommended auth). |
| `LIBRECLIP_API_URL` | `https://api.libreclip.com` | Backend base URL. Set for self-hosting. |
| `LIBRECLIP_DOWNLOAD_DIR` | `./libreclip-downloads` | Where downloaded/exported clips are written. |
| `LIBRECLIP_TIMEOUT` | `60` | HTTP timeout (seconds) for non-download requests. |
| `LIBRECLIP_USER_ID` | – | Self-host only: authenticate by user id (see below). |
| `LIBRECLIP_AUTH_SECRET` | – | Self-host only: backend `BACKEND_AUTH_SECRET` for HMAC signing. |

### Self-hosting auth

If you run your own backend you have three options:

- **API key** (same as hosted): create a key and set `LIBRECLIP_API_KEY`.
- **Signed headers**: set `LIBRECLIP_USER_ID` + `LIBRECLIP_AUTH_SECRET` (your
  backend's `BACKEND_AUTH_SECRET`).
- **Unsigned**: if the backend runs with `ALLOW_UNSIGNED_BACKEND_AUTH=true`,
  just set `LIBRECLIP_USER_ID`.

Auth precedence is: API key → signed headers → unsigned user id.

## Install & run

Requires Python 3.10+. With [uv](https://docs.astral.sh/uv/):

```bash
cd mcp
uv run libreclip-mcp        # runs the stdio server
```

Or install into the current environment:

```bash
pip install -e .
libreclip-mcp
```

## Hosted SSE server

For clients that add a remote MCP URL, run the server over SSE and require a
LibreClip API key as the client Bearer token:

```bash
LIBRECLIP_API_URL=https://api.libreclip.com \
LIBRECLIP_MCP_TRANSPORT=sse \
LIBRECLIP_MCP_HOST=0.0.0.0 \
LIBRECLIP_MCP_PORT=9100 \
LIBRECLIP_MCP_PUBLIC_URL=https://mcp.libreclip.com \
LIBRECLIP_MCP_REQUIRE_BEARER_AUTH=true \
libreclip-mcp
```

Then configure the MCP client with:

```text
Server URL: https://mcp.libreclip.com/sse
Transport: SSE
Authentication: Bearer Token
Token: sk_your_libreclip_api_key
```

With Docker Compose, the `mcp` service runs this mode by default and binds to
`127.0.0.1:9100` for a reverse proxy.

## Use with Claude Desktop / Claude Code

Add to your MCP client config (e.g. `claude_desktop_config.json`, or via
`claude mcp add`). Example using `uv` to run from a checkout:

```json
{
  "mcpServers": {
    "libreclip": {
      "command": "uv",
      "args": ["--directory", "/absolute/path/to/libreclip/mcp", "run", "libreclip-mcp"],
      "env": {
        "LIBRECLIP_API_KEY": "sk_your_key_here"
      }
    }
  }
}
```

For a self-hosted backend, add `"LIBRECLIP_API_URL": "http://localhost:8000"` to `env`.

With Claude Code:

```bash
claude mcp add libreclip -e LIBRECLIP_API_KEY=sk_your_key_here \
  -- uv --directory /absolute/path/to/libreclip/mcp run libreclip-mcp
```

## Example prompts

- "Use libreclip to make clips from https://youtu.be/… with the hormozi caption template, then wait for it and download the top clip."
- "List my recent libreclip tasks and show the virality scores of the latest one's clips."
- "Export clip <id> from task <id> as a TikTok preset."

## License

AGPL-3.0-or-later, matching the LibreClip project.
