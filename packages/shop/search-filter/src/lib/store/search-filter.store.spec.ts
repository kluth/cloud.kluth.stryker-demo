import { TestBed } from '@angular/core/testing';
import { SearchFilterStore } from './search-filter.store';
import { Product } from '@org/models';

describe('SearchFilterStore', () => {
  let store: InstanceType<typeof SearchFilterStore>;

  const mockProducts: Product[] = [
    {
      id: 'p1',
      name: 'Wireless Ergonomic Mouse',
      description: 'Comfortable wireless mouse for long work hours',
      price: 49.99,
      category: 'Peripherals',
      imageUrl: 'https://example.com/mouse.jpg',
      inStock: true,
      rating: 4.8,
      reviewCount: 200,
    },
    {
      id: 'p2',
      name: 'Mechanical Gaming Keyboard',
      description: 'Tactile switches with RGB backlight',
      price: 129.99,
      category: 'Peripherals',
      imageUrl: 'https://example.com/kbd.jpg',
      inStock: false,
      rating: 4.6,
      reviewCount: 150,
    },
    {
      id: 'p3',
      name: '4K Ultra HD Monitor',
      description: '32 inch IPS display panel',
      price: 499.99,
      category: 'Monitors',
      imageUrl: 'https://example.com/mon.jpg',
      inStock: true,
      rating: 4.9,
      reviewCount: 85,
    },
    {
      id: 'p4',
      name: 'USB-C Docking Station',
      description: 'Multi-port hub for laptops',
      price: 89.99,
      category: 'Accessories',
      imageUrl: 'https://example.com/hub.jpg',
      inStock: true,
      rating: 4.2,
      reviewCount: 60,
    },
    {
      id: 'p5',
      name: 'Noise Cancelling Headphones',
      description: 'Over-ear bluetooth audio',
      price: 249.99,
      category: 'Audio',
      imageUrl: 'https://example.com/head.jpg',
      inStock: true,
      rating: 4.7,
      reviewCount: 310,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchFilterStore],
    });
    store = TestBed.inject(SearchFilterStore);
    store.setProducts(mockProducts);
  });

  it('should initialize with all products', () => {
    expect(store.allProducts().length).toBe(5);
    expect(store.filteredProducts().length).toBe(5);
    expect(store.activeFilterCount()).toBe(0);
    expect(store.hasActiveFilters()).toBe(false);
  });

  it('should filter products by search term matching name', () => {
    store.updateSearchTerm('Mouse');
    expect(store.filteredProducts().length).toBe(1);
    expect(store.filteredProducts()[0].id).toBe('p1');
    expect(store.activeFilterCount()).toBe(1);
    expect(store.hasActiveFilters()).toBe(true);
  });

  it('should filter products by search term matching description when name does not match', () => {
    store.updateSearchTerm('laptops'); // Matches description of p4 ("Multi-port hub for laptops")
    expect(store.filteredProducts().length).toBe(1);
    expect(store.filteredProducts()[0].id).toBe('p4');
  });

  it('should filter products by category toggle (selection and unselection)', () => {
    store.toggleCategory('Monitors');
    expect(store.filteredProducts().length).toBe(1);
    expect(store.filteredProducts()[0].id).toBe('p3');
    expect(store.activeFilterCount()).toBe(1);

    store.toggleCategory('Peripherals');
    expect(store.filteredProducts().length).toBe(3); // Monitors + Peripherals

    // Unselect Monitors
    store.toggleCategory('Monitors');
    expect(store.filteredProducts().length).toBe(2);
    expect(store.filteredProducts().every((p) => p.category === 'Peripherals')).toBe(true);
  });

  it('should filter products by exact price boundaries', () => {
    // Exact lower and upper bounds: 49.99 and 499.99
    store.setPriceRange(49.99, 499.99);
    expect(store.filteredProducts().length).toBe(5);
    expect(store.activeFilterCount()).toBe(1);

    // Narrow bounds: 50.00 to 130.00
    store.setPriceRange(50.0, 130.0);
    expect(store.filteredProducts().length).toBe(2); // p2 ($129.99), p4 ($89.99)
  });

  it('should filter products by minimum rating', () => {
    store.setMinRating(4.7);
    expect(store.filteredProducts().length).toBe(3); // p1 (4.8), p3 (4.9), p5 (4.7)
    expect(store.activeFilterCount()).toBe(1);

    store.setMinRating(0);
    expect(store.activeFilterCount()).toBe(0);
  });

  it('should filter in-stock products only', () => {
    store.toggleInStockOnly();
    expect(store.filteredProducts().length).toBe(4); // excludes p2 which is out of stock
    expect(store.activeFilterCount()).toBe(1);

    store.toggleInStockOnly(); // Toggle off
    expect(store.filteredProducts().length).toBe(5);
    expect(store.activeFilterCount()).toBe(0);
  });

  it('should count active filters correctly for multiple combined filters', () => {
    expect(store.activeFilterCount()).toBe(0);

    store.updateSearchTerm('phone');
    expect(store.activeFilterCount()).toBe(1);

    store.toggleCategory('Audio');
    expect(store.activeFilterCount()).toBe(2);

    store.setPriceRange(10, 100);
    expect(store.activeFilterCount()).toBe(3);

    store.setMinRating(4.0);
    expect(store.activeFilterCount()).toBe(4);

    store.toggleInStockOnly();
    expect(store.activeFilterCount()).toBe(5);
  });

  it('should sort products by price ascending and descending', () => {
    store.setSortOption('price_asc');
    const ascPrices = store.sortedProducts().map((p) => p.price);
    expect(ascPrices).toEqual([49.99, 89.99, 129.99, 249.99, 499.99]);

    store.setSortOption('price_desc');
    const descPrices = store.sortedProducts().map((p) => p.price);
    expect(descPrices).toEqual([499.99, 249.99, 129.99, 89.99, 49.99]);
  });

  it('should sort products by rating descending', () => {
    store.setSortOption('rating_desc');
    const ratings = store.sortedProducts().map((p) => p.rating);
    expect(ratings).toEqual([4.9, 4.8, 4.7, 4.6, 4.2]);
  });

  it('should compute product facets correctly including empty state', () => {
    store.setProducts([]);
    const emptyFacets = store.facets();
    expect(emptyFacets.priceRange).toEqual({ min: 0, max: 0 });
    expect(emptyFacets.stockCount).toEqual({ inStock: 0, outOfStock: 0 });

    store.setProducts(mockProducts);
    const facets = store.facets();
    expect(facets.categoryCounts['Peripherals']).toBe(2);
    expect(facets.categoryCounts['Monitors']).toBe(1);
    expect(facets.stockCount.inStock).toBe(4);
    expect(facets.stockCount.outOfStock).toBe(1);
    expect(facets.priceRange.min).toBe(49.99);
    expect(facets.priceRange.max).toBe(499.99);
    expect(facets.ratingCounts[4]).toBe(5);
  });

  it('should paginate results properly', () => {
    store.setPageSize(2);
    expect(store.totalPages()).toBe(3);

    store.setPage(1);
    expect(store.paginatedProducts().length).toBe(2);
    expect(store.paginatedProducts()[0].id).toBe('p3');

    store.setPage(2);
    expect(store.paginatedProducts().length).toBe(2);
    expect(store.paginatedProducts()[0].id).toBe('p5');
  });

  it('should reset all filters', () => {
    store.updateSearchTerm('keyboard');
    store.setMinRating(4.5);
    store.toggleInStockOnly();
    expect(store.hasActiveFilters()).toBe(true);

    store.resetFilters();
    expect(store.hasActiveFilters()).toBe(false);
    expect(store.filteredProducts().length).toBe(5);
  });
});
