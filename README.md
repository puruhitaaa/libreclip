# LibreClip

<p align="center">
  <img src="assets/banner.png" alt="LibreClip Banner" width="100%" />
</p>

<p align="center">
  <strong>An open-source AI video clipping platform that transforms long-form content into viral short clips.</strong>
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> •
  <a href="#why-libreclip">Why LibreClip</a> •
  <a href="#features">Features</a> •
  <a href="#configuration--tuning">Configuration</a> •
  <a href="#testing">Testing</a> •
  <a href="docs/README.md">Documentation</a> •
  <a href="#license--contributing">License</a>
</p>

---

LibreClip provides automated, AI-powered video clipping capabilities in a transparent, self-hostable package. Run it entirely on your own infrastructure, inspect every stage of the pipeline, and customize it to suit your specific workflows without vendor lock-in or artificial limits.

## Why LibreClip?

Commercial tools like OpusClip are effective, but they often come with restrictive caps, proprietary black-box pipelines, and vendor lock-in:

- **Usage Caps & Minute Limits**: Processing quotas restrict how much content you can produce.
- **Watermarks & Branding**: Free or lower-tier exports often enforce third-party branding.
- **Opaque Processing**: Proprietary algorithms limit control over transcription, prompt engineering, and clipping criteria.
- **Infrastructure Dependency**: Your production pipeline is tied to third-party server availability and pricing changes.

### The LibreClip Solution

- 🚀 **100% Self-Hostable**: Deploy on your own servers or local machine using Docker.
- 🔓 **No Watermarks**: Your content remains completely yours.
- 📖 **Open Source & Transparent**: AGPL-3.0 licensed with clear, modular architecture.
- ⚡ **Unlimited Processing**: Process as many videos as your hardware and provider quotas allow.
- 🧩 **Modular LLM Support**: Choose between Google Gemini, OpenAI, Anthropic Claude, or local models via Ollama.
- 🛠️ **Fully Customizable**: Extend editing logic, subtitle styles, and virality scoring rules.

---

## Features

- **Automated Clip Detection**: Identifies engaging hooks and cohesive segments from long-form videos.
- **Accurate Speech-to-Text**: Fast, high-accuracy transcriptions powered by AssemblyAI.
- **Virality Scoring & Analysis**: Uses LLMs to evaluate hook strength, narrative flow, and engagement potential.
- **Dynamic Captions & Subtitles**: Customizable font styles, positioning, and animations.
- **Multi-Provider AI Analysis**: Native support for Gemini, GPT, Claude, and local Ollama instances.
- **FastAPI Backend + Next.js Frontend**: High-performance asynchronous processing paired with a responsive web dashboard.

---

## Quick Start

### Prerequisites

- **Docker & Docker Compose** installed on your system.
- An **[AssemblyAI API Key](https://www.assemblyai.com/)** for video transcription.
- An **LLM API Key** (Google Gemini, OpenAI, Anthropic) or a local **Ollama** setup.

### 1. Clone the Repository

```bash
git clone https://github.com/puruhitaaa/libreclip.git
cd libreclip
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` to set your transcription and LLM credentials:

```env
# Required: Video transcription
ASSEMBLY_AI_API_KEY=your_assemblyai_api_key

# Required: Choose ONE LLM provider
# Option A: Google Gemini (recommended - fast & cost-effective)
LLM=google-gla:gemini-3-flash-preview
GOOGLE_API_KEY=your_google_api_key

# Option B: OpenAI
# LLM=openai:gpt-5.2
# OPENAI_API_KEY=your_openai_api_key

# Option C: Anthropic Claude
# LLM=anthropic:claude-4-sonnet
# ANTHROPIC_API_KEY=your_anthropic_api_key

# Option D: Ollama (local/self-hosted)
# LLM=ollama:gpt-oss:20b
# OLLAMA_BASE_URL=http://localhost:11434/v1
```

### 3. Start the Stack

```bash
docker-compose up -d
```

This starts all necessary services:
- **Frontend Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000) (Interactive Swagger docs at `/docs`)
- **PostgreSQL**: `localhost:5432`
- **Redis Queue**: `localhost:6379`

### 4. Monitor Initialization

Check container logs to monitor first-time database migrations and service startup:

```bash
docker-compose logs -f
```

Once services report healthy, navigate to [http://localhost:3000](http://localhost:3000) to create your account and start clipping videos.

---

## Configuration & Tuning

### Performance Modes

LibreClip supports multiple processing modes configurable via environment variables:

- `DEFAULT_PROCESSING_MODE`: `fast` (default), `balanced`, or `quality`.
- `FAST_MODE_MAX_CLIPS`: Maximum number of clips generated in fast mode (default: `4`).
- `FAST_MODE_TRANSCRIPT_MODEL`: Set transcription model speed (e.g., `nano` for accelerated processing).
- Metrics endpoint: Monitor processing times via `GET /tasks/metrics/performance`.

### Custom Fonts

Add custom `.ttf` or `.otf` fonts to `backend/fonts/` to make them available in the subtitle editor. For setup details, see [backend/fonts/README.md](backend/fonts/README.md).

### YouTube Metadata

- `YOUTUBE_METADATA_PROVIDER=yt_dlp` (default): Uses `yt-dlp` for video metadata extraction.
- `YOUTUBE_METADATA_PROVIDER=youtube_data_api`: Uses the official Google YouTube Data API v3 (requires `YOUTUBE_DATA_API_KEY` or `GOOGLE_API_KEY`) with automatic fallback to `yt-dlp`.

---

## Troubleshooting

- **Backend fails to start with API key error**: Verify the chosen `LLM` provider in `.env` matches your configured API key (e.g. `GOOGLE_API_KEY` for Gemini, `OPENAI_API_KEY` for GPT).
- **Videos stay queued / never process**: Ensure Redis is running (`docker-compose logs redis`) and check worker logs with `docker-compose logs -f worker`.
- **Database connection errors on first start**: PostgreSQL may take a few seconds to initialize its initial schema; restart with `docker-compose up -d`.

---

## Testing

LibreClip includes an automated test suite across backend and frontend layers:

- **Backend**: `pytest` for unit and integration testing.
- **Frontend**: `Vitest` and Testing Library for route and component tests.
- **End-to-End**: `Playwright` for browser smoke testing.

Run tests locally:

```bash
# Run complete test suite
make test

# Or run individual test targets
make test-backend
make test-frontend
make test-e2e
```

---

## Documentation

Comprehensive guides and architectural references are available in the [`docs/`](docs/README.md) directory:

- [Setup Guide](docs/setup.md)
- [Configuration Reference](docs/configuration.md)
- [Application Guide](docs/app-guide.md)
- [System Architecture](docs/architecture.md)
- [API Reference](docs/api-reference.md)
- [Development Guidelines](docs/development.md)
- [Troubleshooting](docs/troubleshooting.md)

---

## Local Development (Without Docker)

To run services directly on your host machine for development:

1. **Backend**: Follow instructions in [backend/README.md](backend/README.md) using `uv` and `uvicorn`.
2. **Frontend**: Install dependencies with `npm install` and run `npm run dev`.
3. See [CLAUDE.md](CLAUDE.md) for full developer shortcuts and workflow instructions.

---

## License & Contributing

LibreClip is released under the **AGPL-3.0 License**. See [LICENSE](LICENSE) for details.

Contributions are welcome! Please review [CONTRIBUTING.md](CONTRIBUTING.md) for pull request guidelines and contribution terms.
