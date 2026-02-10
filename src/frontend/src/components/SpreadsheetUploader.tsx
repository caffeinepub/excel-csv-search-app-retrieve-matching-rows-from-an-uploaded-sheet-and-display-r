import { Upload, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface SpreadsheetUploaderProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  error: string | null;
  columnCount: number;
}

export function SpreadsheetUploader({ 
  onFileSelect, 
  isLoading, 
  error,
  columnCount 
}: SpreadsheetUploaderProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Upload Spreadsheet
        </CardTitle>
        <CardDescription>
          Select a .csv or .xlsx file to search through its data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="relative"
            disabled={isLoading}
            asChild
          >
            <label className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" />
              {isLoading ? 'Processing...' : 'Choose File'}
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={isLoading}
              />
            </label>
          </Button>
          {columnCount > 0 && (
            <Badge variant="secondary">
              {columnCount} column{columnCount !== 1 ? 's' : ''} detected
            </Badge>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
