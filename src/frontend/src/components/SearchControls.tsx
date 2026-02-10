import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { SpreadsheetColumn, MatchMode, ALL_COLUMNS_SENTINEL } from '@/lib/spreadsheet/types';

interface SearchControlsProps {
  columns: SpreadsheetColumn[];
  onSearch: (columnName: string, value: string, mode: MatchMode) => void;
  disabled?: boolean;
}

export function SearchControls({ columns, onSearch, disabled }: SearchControlsProps) {
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [searchValue, setSearchValue] = useState('');
  const [matchMode, setMatchMode] = useState<MatchMode>('contains');

  const handleSearch = () => {
    if (selectedColumn && searchValue.trim()) {
      onSearch(selectedColumn, searchValue, matchMode);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Data
        </CardTitle>
        <CardDescription>
          Select a column (or search all columns) and enter a value to find matching rows
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="column-select">Search Column</Label>
            <Select
              value={selectedColumn}
              onValueChange={setSelectedColumn}
              disabled={disabled || columns.length === 0}
            >
              <SelectTrigger id="column-select">
                <SelectValue placeholder="Select a column" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_COLUMNS_SENTINEL}>
                  All columns
                </SelectItem>
                {columns.map(col => (
                  <SelectItem key={col.name} value={col.name}>
                    {col.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="search-value">Search Value</Label>
            <Input
              id="search-value"
              placeholder="Enter value to search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={disabled}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="match-mode"
              checked={matchMode === 'exact'}
              onCheckedChange={(checked) => setMatchMode(checked ? 'exact' : 'contains')}
              disabled={disabled}
            />
            <Label htmlFor="match-mode" className="cursor-pointer">
              Exact match {matchMode === 'exact' ? '(enabled)' : '(disabled - contains mode)'}
            </Label>
          </div>

          <Button
            onClick={handleSearch}
            disabled={disabled || !selectedColumn || !searchValue.trim()}
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          {matchMode === 'exact' 
            ? 'Exact match: Finds rows where the column value exactly matches your search (after trimming whitespace).'
            : 'Contains mode: Finds rows where the column value contains your search text (case-insensitive).'}
        </p>
      </CardContent>
    </Card>
  );
}
