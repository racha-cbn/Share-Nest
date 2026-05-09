import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CATEGORIES } from "@/data/posts";

interface FilterBarProps {
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export function FilterBar({
  typeFilter,
  setTypeFilter,
  categoryFilter,
  setCategoryFilter,
  searchQuery,
  setSearchQuery,
}: FilterBarProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-8 flex flex-col md:flex-row gap-4 items-center">
      <div className="relative w-full md:w-1/3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Rechercher..." 
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          data-testid="input-search"
        />
      </div>
      
      <div className="w-full md:w-auto flex-1 flex justify-center md:justify-start">
        <ToggleGroup type="single" value={typeFilter} onValueChange={(v) => v && setTypeFilter(v)}>
          <ToggleGroupItem value="toutes" aria-label="Toutes" data-testid="filter-toutes">
            Toutes
          </ToggleGroupItem>
          <ToggleGroupItem value="offre" aria-label="Offres" data-testid="filter-offres">
            Offres
          </ToggleGroupItem>
          <ToggleGroupItem value="demande" aria-label="Demandes" data-testid="filter-demandes">
            Demandes
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="w-full md:w-1/4">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger data-testid="select-category">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="toutes">Toutes les catégories</SelectItem>
            {CATEGORIES.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
