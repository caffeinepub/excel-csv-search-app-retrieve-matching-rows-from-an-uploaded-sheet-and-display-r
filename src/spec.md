# Specification

## Summary
**Goal:** Allow users to search for a value across the entire uploaded spreadsheet (all columns) and view full matching rows with headers as labels.

**Planned changes:**
- Add an “All columns” option to the search UI alongside existing specific-column selection.
- Update client-side search logic to treat a row as a match when any cell matches the entered value under the selected match mode (Exact vs Case-insensitive contains), using the existing trimming/normalization rules.
- Display search results as full matching rows in the existing key/value layout, using spreadsheet headers (or generated column names) as labels.
- Ensure the search action works without choosing a specific column when “All columns” is selected, with user-facing text in English.
- Keep existing column-specific search behavior unchanged when a specific column is selected.

**User-visible outcome:** Users can search by any value across the entire sheet and get back full rows where any cell matches, displayed with column headers as labels, while still being able to search within a single selected column.
