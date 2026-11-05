# Example workspace database schema

This is a **fictional schema** showing how a workspace database (such as Notion) could represent work in progress. It is not an export from any connected workspace.

| Property | Example type | Purpose |
| --- | --- | --- |
| `Name` | Title | Fictional record label |
| `Record ID` | Text | Stable example identifier |
| `Status` | Select | `READY`, `PARTIAL`, `VALIDATED` |
| `Photo count` | Number | Expected workload size |
| `Next photo` | Number | 0-based checkpoint for safe resumption |
| `Issue type` | Select | e.g. `SIMULATED_RATE_LIMIT` or empty |
| `Output preview` | Text / JSON | Only synthetic data, approved after validation |

Example:

```json
{
  "Name": "Harbor Studio",
  "Record ID": "demo-001",
  "Status": "PARTIAL",
  "Photo count": 2,
  "Next photo": 1,
  "Issue type": "SIMULATED_RATE_LIMIT",
  "Output preview": null
}
```

There are no database IDs, URLs, tokens, internal links or personal data in this repository.
