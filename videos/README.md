# Showcase Videos

Drop showcase clips into `videos/showcase/` and enable them in `videos/manifest.js`.

## How it works

- Every project detail page and engineering detail page has a reserved manifest entry.
- The site script reads `videos/manifest.js` and injects a `Showcase Video` section automatically when an entry is enabled.
- Files should be referenced from the site root, for example `videos/showcase/site-23.mp4`.

## Recommended workflow

1. Export an `mp4` file for the page you want to update.
2. Save it into `videos/showcase/` using the page slug as the file name.
3. Optionally add a poster image path in `videos/manifest.js`.
4. Set `enabled: true` for that entry.
5. Refresh the page.

## Suggested file names

### Projects

- `site-23.mp4`
- `data-hunters.mp4`
- `your-shadow.mp4`
- `rps.mp4`
- `slime-dungeon.mp4`

### Engineering

- `procedural-map-generation.mp4`
- `smart-ai-group-pathfinding.mp4`
- `functional-gameplay-architecture.mp4`
- `dynamic-weapon-sway.mp4`
- `server-authoritative-hit-validation.mp4`
- `projectile-simulation.mp4`
- `modular-weapon-framework.mp4`
- `persistent-player-data.mp4`
- `matchmaking-lobby-system.mp4`
- `sandbox-placement-system.mp4`
