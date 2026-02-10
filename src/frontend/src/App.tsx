import { useState } from 'react';
import { SpreadsheetUploader } from './components/SpreadsheetUploader';
import { SearchControls } from './components/SearchControls';
import { ResultsList } from './components/ResultsList';
import { parseSpreadsheet } from './lib/spreadsheet/parseSpreadsheet';
import { searchRows } from './lib/spreadsheet/search';
import { ParsedSpreadsheet, SpreadsheetRow, MatchMode } from './lib/spreadsheet/types';
import { Heart } from 'lucide-react';

function App() {
  const [spreadsheet, setSpreadsheet] = useState<ParsedSpreadsheet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SpreadsheetRow[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setParseError(null);
    setSpreadsheet(null);
    setSearchResults([]);
    setSearchPerformed(false);

    const result = await parseSpreadsheet(file);

    if (result.success) {
      setSpreadsheet(result.data);
    } else {
      setParseError(result.error.message);
    }

    setIsLoading(false);
  };

  const handleSearch = (columnName: string, value: string, mode: MatchMode) => {
    if (!spreadsheet) return;

    const results = searchRows(spreadsheet.rows, columnName, value, mode);
    setSearchResults(results);
    setSearchPerformed(true);
  };

  const getAppIdentifier = () => {
    try {
      return encodeURIComponent(window.location.hostname || 'spreadsheet-search-app');
    } catch {
      return 'spreadsheet-search-app';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold tracking-tight">Spreadsheet Search</h1>
          <p className="text-muted-foreground mt-2">
            Upload a spreadsheet and search for data by column values
          </p>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <SpreadsheetUploader
            onFileSelect={handleFileSelect}
            isLoading={isLoading}
            error={parseError}
            columnCount={spreadsheet?.columns.length || 0}
          />

          {spreadsheet && (
            <>
              <SearchControls
                columns={spreadsheet.columns}
                onSearch={handleSearch}
                disabled={isLoading}
              />

              <ResultsList
                results={searchResults}
                columns={spreadsheet.columns}
                searchPerformed={searchPerformed}
              />
            </>
          )}
        </div>
      </main>

      <footer className="border-t bg-card mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Spreadsheet Search. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
              Built with <Heart className="h-4 w-4 fill-accent text-accent" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${getAppIdentifier()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline inline-flex items-center gap-1"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
