# Public showcase: safety boundaries

This repository contains **new demonstration code** and synthetic records, not copies of proprietary client files. It intentionally omits:

- Credentials, API tokens, secret headers, OAuth sessions, cookies and environment files.
- Real workspace/database IDs, customer names, live property links, unpublished descriptions or photo URLs.
- Real production n8n exports, API request configuration, execution history or node-level settings.
- Scripts targeting real business/admin domains, including save/publish buttons.
- Business data, guest information, financial records or any internal operational figures.

The two Tampermonkey examples have a strict `@match` to `http://localhost:4173/demo/editor.html`, check a demo-only body attribute, require a click and **never submit** the form.

The example n8n workflows use manual triggers and JavaScript code nodes only. They have no credentials or external requests.

Before deploying anything adapted from this demo, implement authentication, rate-limit handling, durable checkpoints, logging, input validation, idempotency checks, data retention controls and tests appropriate to the environment.

If the underlying professional work was subject to an NDA, employer IP agreement or client confidentiality, confirm permission before publishing *any* actual materials. This synthetic demo is specifically designed to avoid requiring those materials.
