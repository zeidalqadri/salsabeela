'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDebouncedCallback } from 'use-debounce';
import { useRouter, useSearchParams } from 'next/navigation';

export function SearchInput() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    router.replace(`?${params.toString()}`);
  }, 300);

  return (
    <div data-testid="search-container" className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        data-testid="search-input"
        type="search"
        placeholder="Search documents..."
        className="pl-10"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <button data-testid="search-button">Search</button>
    </div>
  );
} 