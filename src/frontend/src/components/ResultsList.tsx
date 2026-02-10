import { SpreadsheetRow, SpreadsheetColumn } from '@/lib/spreadsheet/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ResultsListProps {
  results: SpreadsheetRow[];
  columns: SpreadsheetColumn[];
  searchPerformed: boolean;
}

export function ResultsList({ results, columns, searchPerformed }: ResultsListProps) {
  if (!searchPerformed) {
    return null;
  }

  const formatValue = (value: any): string => {
    if (value === null || value === undefined || value === '') {
      return '—';
    }
    return String(value);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Search Results</CardTitle>
          <Badge variant={results.length > 0 ? 'default' : 'secondary'}>
            {results.length} match{results.length !== 1 ? 'es' : ''}
          </Badge>
        </div>
        <CardDescription>
          {results.length === 0 
            ? 'No matching rows found for your search criteria.'
            : `Displaying ${results.length} matching row${results.length !== 1 ? 's' : ''} with all column values.`}
        </CardDescription>
      </CardHeader>
      {results.length > 0 && (
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-6">
              {results.map((row, rowIndex) => (
                <div key={rowIndex}>
                  {rowIndex > 0 && <Separator className="my-6" />}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline">Row {rowIndex + 1}</Badge>
                    </div>
                    <div className="grid gap-3">
                      {columns.map(col => (
                        <div 
                          key={col.name}
                          className="grid grid-cols-[200px_1fr] gap-4 items-start"
                        >
                          <div className="font-medium text-sm text-muted-foreground truncate">
                            {col.name}
                          </div>
                          <div className="text-sm break-words">
                            {formatValue(row[col.name])}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  );
}
