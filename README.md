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

## Automated title-screen capture

With Chromium or Google Chrome installed, run:

```bash
./scripts/capture-screenshot.sh
```

The script starts a temporary local server and writes `screenshots/title-screen.png`. Set
`CHROME_BIN` when the browser executable is not available on `PATH`.
