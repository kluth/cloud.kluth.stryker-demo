import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFilterStore } from '../store/search-filter.store';

@Component({
  selector: 'lib-search-filter-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="search-filter-bar bg-gray-50 p-4 rounded-lg border mb-4 flex flex-wrap gap-4 items-center">
      <input
        type="text"
        placeholder="Produkte suchen..."
        [value]="store.filterState().searchTerm"
        (input)="onSearchInput($event)"
        class="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        (click)="store.toggleInStockOnly()"
        class="px-3 py-2 text-sm rounded border"
        [class.bg-green-100]="store.filterState().inStockOnly"
        [class.text-green-700]="store.filterState().inStockOnly"
      >
        {{ store.filterState().inStockOnly ? '✓ Nur Auf Lager' : 'Auf Lager' }}
      </button>
      <button
        *ngIf="store.hasActiveFilters()"
        (click)="store.resetFilters()"
        class="text-sm text-indigo-600 underline"
      >
        Filter zurücksetzen ({{ store.activeFilterCount() }})
      </button>
    </div>
  `,
})
export class SearchFilterBarComponent {
  readonly store = inject(SearchFilterStore);

  onSearchInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.store.updateSearchTerm(val);
  }
}
