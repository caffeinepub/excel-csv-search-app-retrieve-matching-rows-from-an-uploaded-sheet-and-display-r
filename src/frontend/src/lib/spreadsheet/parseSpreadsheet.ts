import { ParseResult, SpreadsheetColumn, SpreadsheetRow } from './types';

// Generate column names when headers are missing
function generateColumnName(index: number): string {
  let name = '';
  let num = index;
  while (num >= 0) {
    name = String.fromCharCode(65 + (num % 26)) + name;
    num = Math.floor(num / 26) - 1;
  }
  return `Column ${name}`;
}

// Check if a row is completely empty
function isRowEmpty(row: any[]): boolean {
  return row.every(cell => cell === null || cell === undefined || String(cell).trim() === '');
}

// Normalize cell value
function normalizeCell(value: any): string | number | boolean | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed === '' ? null : trimmed;
  }
  return value;
}

// Parse CSV file
async function parseCSV(file: File): Promise<ParseResult> {
  try {
    const text = await file.text();
    const lines = text.split(/\r?\n/);
    
    if (lines.length === 0) {
      return {
        success: false,
        error: { message: 'The CSV file is empty.' }
      };
    }

    // Simple CSV parser (handles basic cases)
    const parseCSVLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          result.push(current);
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current);
      return result;
    };

    const allRows = lines
      .map(line => parseCSVLine(line))
      .filter(row => !isRowEmpty(row));

    if (allRows.length === 0) {
      return {
        success: false,
        error: { message: 'The CSV file contains no data.' }
      };
    }

    // First row as headers
    const headerRow = allRows[0];
    const dataRows = allRows.slice(1);

    // Generate columns
    const columns: SpreadsheetColumn[] = headerRow.map((header, index) => {
      const trimmed = String(header || '').trim();
      return {
        name: trimmed === '' ? generateColumnName(index) : trimmed,
        index
      };
    });

    // Parse data rows
    const rows: SpreadsheetRow[] = dataRows.map(row => {
      const rowData: SpreadsheetRow = {};
      columns.forEach(col => {
        const value = row[col.index];
        rowData[col.name] = normalizeCell(value);
      });
      return rowData;
    });

    return {
      success: true,
      data: { columns, rows }
    };
  } catch (error) {
    return {
      success: false,
      error: { 
        message: `Failed to parse CSV file: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }
    };
  }
}

// Load SheetJS library dynamically
let xlsxLibLoaded = false;
let xlsxLibLoading: Promise<void> | null = null;

async function loadXLSXLibrary(): Promise<void> {
  if (xlsxLibLoaded) return;
  if (xlsxLibLoading) return xlsxLibLoading;

  xlsxLibLoading = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js';
    script.onload = () => {
      xlsxLibLoaded = true;
      resolve();
    };
    script.onerror = () => {
      reject(new Error('Failed to load XLSX library'));
    };
    document.head.appendChild(script);
  });

  return xlsxLibLoading;
}

// Parse XLSX file using SheetJS from CDN
async function parseXLSX(file: File): Promise<ParseResult> {
  try {
    // Load the XLSX library if not already loaded
    await loadXLSXLibrary();

    // Access the global XLSX object
    const XLSX = (window as any).XLSX;
    if (!XLSX) {
      throw new Error('XLSX library not available');
    }

    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    
    // Parse the workbook
    const workbook = XLSX.read(data, { type: 'array' });
    
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      return {
        success: false,
        error: { message: 'The Excel file contains no sheets.' }
      };
    }

    // Get the first sheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Convert to array of arrays
    const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (!rows || rows.length === 0) {
      return {
        success: false,
        error: { message: 'The Excel file is empty.' }
      };
    }

    // Filter out completely empty rows
    const nonEmptyRows = rows.filter(row => !isRowEmpty(row));

    if (nonEmptyRows.length === 0) {
      return {
        success: false,
        error: { message: 'The Excel file contains no data.' }
      };
    }

    // First row as headers
    const headerRow = nonEmptyRows[0];
    const dataRows = nonEmptyRows.slice(1);

    // Generate columns
    const columns: SpreadsheetColumn[] = headerRow.map((header, index) => {
      const trimmed = String(header || '').trim();
      return {
        name: trimmed === '' ? generateColumnName(index) : trimmed,
        index
      };
    });

    // Parse data rows
    const parsedRows: SpreadsheetRow[] = dataRows.map(row => {
      const rowData: SpreadsheetRow = {};
      columns.forEach(col => {
        const value = row[col.index];
        rowData[col.name] = normalizeCell(value);
      });
      return rowData;
    });

    return {
      success: true,
      data: { columns, rows: parsedRows }
    };
  } catch (error) {
    return {
      success: false,
      error: { 
        message: `Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}. Please ensure the file is a valid .xlsx file.` 
      }
    };
  }
}

// Main parse function
export async function parseSpreadsheet(file: File): Promise<ParseResult> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'csv') {
    return parseCSV(file);
  } else if (extension === 'xlsx') {
    return parseXLSX(file);
  } else {
    return {
      success: false,
      error: { 
        message: 'Unsupported file format. Please upload a .csv or .xlsx file.' 
      }
    };
  }
}
