# Launchpad

Launchpad is a Pages Router website-building workspace built on Next.js 16, React 19 and Tailwind CSS 4.

## Development

Copy `.env.example` to `.env.local`, install dependencies with `npm ci`, then run `npm run dev`.

The current vertical slice includes a functional sites workspace, searchable data-driven templates and a responsive editor with schema validation, selection, property editing, bounded history and durable browser draft persistence. Internal modules expose public APIs through barrel files, while stateful product behaviour is encapsulated in focused hooks. Server-backed identity, MongoDB, Payload infrastructure and billing remain integration boundaries for a subsequent delivery and are not represented as configured features.
