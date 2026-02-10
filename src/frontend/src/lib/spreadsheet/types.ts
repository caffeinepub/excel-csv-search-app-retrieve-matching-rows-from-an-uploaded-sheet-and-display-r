// Spreadsheet data types

export interface SpreadsheetColumn {
  name: string;
  index: number;
}

export interface SpreadsheetRow {
  [columnName: string]: string | number | boolean | null;
}

export interface ParsedSpreadsheet {
  columns: SpreadsheetColumn[];
  rows: SpreadsheetRow[];
}

export interface ParseError {
  message: string;
}

export type ParseResult = 
  | { success: true; data: ParsedSpreadsheet }
  | { success: false; error: ParseError };

export type MatchMode = 'exact' | 'contains';

// Sentinel value for "All columns" search
export const ALL_COLUMNS_SENTINEL = '__ALL_COLUMNS__';
