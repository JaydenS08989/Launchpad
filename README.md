# Vice Horizon

An original PlayCanvas crime-action vertical slice. No proprietary game assets are included.

## Run

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173` in a current WebGPU-capable desktop browser. WebGL2 is used as a fallback.

## Controls

| Input | Action |
| --- | --- |
| WASD | Move / drive |
| Shift | Sprint |
| E | Enter or exit vehicle |
| Mouse | Orbit camera |
| Right mouse | Aim |
| Left mouse | Fire |
| R | Reload |
| N | Cycle time of day |
| P | Download a PNG screenshot of the current game view |

The photo capture is performed directly from the PlayCanvas viewport, so the resulting PNG reflects the live rendered scene rather than a mock-up.

## Tripo asset import

The canonical Tripo MCP export contract is defined in `data/tripo-assets.json`. It requires project-owned GLB exports with embedded 4096×4096 PBR textures; no proprietary source assets are accepted. After exporting the named assets from Tripo, import and validate the complete set with:

```bash
node scripts/import-tripo-assets.mjs /path/to/tripo-exports
```

The importer deliberately fails if any required model is absent or suspiciously small, rather than silently presenting primitive placeholders as generated artwork. The current repository does not include fabricated Tripo output: generated binary assets must come from an authenticated Tripo MCP session.

## Automated title-screen capture

With Chromium or Google Chrome installed, run:

```bash
./scripts/capture-screenshot.sh
```

The script starts a temporary local server and writes `screenshots/title-screen.png`. Set
`CHROME_BIN` when the browser executable is not available on `PATH`.
