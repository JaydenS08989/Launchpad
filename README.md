# Launchpad

Launchpad is a Pages Router website-building workspace built on Next.js 16, React 19 and Tailwind CSS 4.

## Development

Copy `.env.example` to `.env.local`, install dependencies with `npm ci`, then run `npm run dev`.

The current vertical slice includes secure password registration and sign-in, signed HTTP-only sessions, protected product routes, an authenticated site API, a functional sites workspace, searchable data-driven templates and a responsive editor with schema validation, selection, property editing, bounded history and server-side draft persistence. Internal modules expose public APIs through barrel files, while client server-state is managed through TanStack Query hooks.

The included file-backed identity repository is intended for a single-instance local environment. MongoDB-backed multi-tenant data, Payload infrastructure and billing remain integration boundaries for a subsequent delivery and are not represented as configured features.
