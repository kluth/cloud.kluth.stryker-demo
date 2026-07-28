import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { Product, FilterState, SortOption, ProductFacets } from '@org/models';

export interface SearchFilterState {
  allProducts: Product[];
  filterState: FilterState;
  sortOption: SortOption;
  currentPage: number;
  pageSize: number;
}

const initialFilterState: FilterState = {
  searchTerm: '',
  categories: [],
  minPrice: 0,
  maxPrice: 10000,
  minRating: 0,
  inStockOnly: false,
  selectedTags: [],
};

const initialState: SearchFilterState = {
  allProducts: [],
  filterState: initialFilterState,
  sortOption: 'name_asc',
  currentPage: 1,
  pageSize: 10,
};

export const SearchFilterStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => {
    const filteredProducts = () => {
      const { searchTerm, categories, minPrice, maxPrice, minRating, inStockOnly } =
        store.filterState();

      return store.allProducts().filter((p) => {
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          const matchName = p.name.toLowerCase().includes(term);
          const matchDesc = p.description.toLowerCase().includes(term);
          if (!matchName && !matchDesc) return false;
        }

        if (categories.length > 0 && !categories.includes(p.category)) {
          return false;
        }

        if (p.price < minPrice || p.price > maxPrice) {
          return false;
        }

        if (p.rating < minRating) {
          return false;
        }

        if (inStockOnly && !p.inStock) {
          return false;
        }

        return true;
      });
    };

    const sortedProducts = () => {
      const list = [...filteredProducts()];
      const opt = store.sortOption();

      switch (opt) {
        case 'price_asc':
          return list.sort((a, b) => a.price - b.price);
        case 'price_desc':
          return list.sort((a, b) => b.price - a.price);
        case 'rating_desc':
          return list.sort((a, b) => b.rating - a.rating);
        case 'name_asc':
        default:
          return list.sort((a, b) => a.name.localeCompare(b.name));
      }
    };

    const totalPages = () =>
      Math.ceil(sortedProducts().length / store.pageSize()) || 1;

    const paginatedProducts = () => {
      const page = store.currentPage();
      const size = store.pageSize();
      const start = (page - 1) * size;
      return sortedProducts().slice(start, start + size);
    };

    const facets = (): ProductFacets => {
      const products = store.allProducts();
      const categoryCounts: Record<string, number> = {};
      const ratingCounts: Record<number, number> = {};
      let min = Infinity;
      let max = -Infinity;
      let inStock = 0;
      let outOfStock = 0;

      for (const p of products) {
        categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
        const roundRating = Math.floor(p.rating);
        ratingCounts[roundRating] = (ratingCounts[roundRating] || 0) + 1;

        if (p.price < min) min = p.price;
        if (p.price > max) max = p.price;

        if (p.inStock) inStock++;
        else outOfStock++;
      }

      return {
        categoryCounts,
        priceRange: { min: min === Infinity ? 0 : min, max: max === -Infinity ? 0 : max },
        stockCount: { inStock, outOfStock },
        ratingCounts,
      };
    };

    const activeFilterCount = () => {
      const f = store.filterState();
      let count = 0;
      if (f.searchTerm.trim().length > 0) count++;
      if (f.categories.length > 0) count++;
      if (f.minPrice > 0 || f.maxPrice < 10000) count++;
      if (f.minRating > 0) count++;
      if (f.inStockOnly) count++;
      return count;
    };

    const hasActiveFilters = () => activeFilterCount() > 0;

    return {
      filteredProducts,
      sortedProducts,
      paginatedProducts,
      totalPages,
      facets,
      activeFilterCount,
      hasActiveFilters,
    };
  }),
  withMethods((store) => ({
    setProducts(products: Product[]) {
      patchState(store, { allProducts: products, currentPage: 1 });
    },

    updateSearchTerm(term: string) {
      patchState(store, {
        filterState: { ...store.filterState(), searchTerm: term },
        currentPage: 1,
      });
    },

    toggleCategory(category: string) {
      const current = store.filterState().categories;
      const updated = current.includes(category)
        ? current.filter((c) => c !== category)
        : [...current, category];
      patchState(store, {
        filterState: { ...store.filterState(), categories: updated },
        currentPage: 1,
      });
    },

    setPriceRange(min: number, max: number) {
      patchState(store, {
        filterState: { ...store.filterState(), minPrice: min, maxPrice: max },
        currentPage: 1,
      });
    },

    setMinRating(rating: number) {
      patchState(store, {
        filterState: { ...store.filterState(), minRating: rating },
        currentPage: 1,
      });
    },

    toggleInStockOnly() {
      patchState(store, {
        filterState: {
          ...store.filterState(),
          inStockOnly: !store.filterState().inStockOnly,
        },
        currentPage: 1,
      });
    },

    setSortOption(option: SortOption) {
      patchState(store, { sortOption: option });
    },

    setPage(page: number) {
      patchState(store, { currentPage: page });
    },

    setPageSize(size: number) {
      patchState(store, { pageSize: size, currentPage: 1 });
    },

    resetFilters() {
      patchState(store, {
        filterState: initialFilterState,
        currentPage: 1,
      });
    },
  }))
);
