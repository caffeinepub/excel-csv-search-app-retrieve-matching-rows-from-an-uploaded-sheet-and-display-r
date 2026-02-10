import { SpreadsheetRow, MatchMode, ALL_COLUMNS_SENTINEL } from './types';

// Normalize value for comparison
function normalizeValue(value: any): string {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

// Filter rows based on search criteria
export function searchRows(
  rows: SpreadsheetRow[],
  columnName: string,
  searchValue: string,
  mode: MatchMode
): SpreadsheetRow[] {
  const normalizedSearch = normalizeValue(searchValue);

  if (normalizedSearch === '') {
    return [];
  }

  // Check if searching all columns
  const isAllColumns = columnName === ALL_COLUMNS_SENTINEL;

  return rows.filter(row => {
    if (isAllColumns) {
      // Search across all columns - match if any cell matches
      return Object.values(row).some(cellValue => {
        const normalized = normalizeValue(cellValue);
        
        if (mode === 'exact') {
          return normalized === normalizedSearch;
        } else {
          // Case-insensitive contains
          return normalized.toLowerCase().includes(normalizedSearch.toLowerCase());
        }
      });
    } else {
      // Search specific column
      const cellValue = normalizeValue(row[columnName]);

      if (mode === 'exact') {
        return cellValue === normalizedSearch;
      } else {
        // Case-insensitive contains
        return cellValue.toLowerCase().includes(normalizedSearch.toLowerCase());
      }
    }
  });
}
