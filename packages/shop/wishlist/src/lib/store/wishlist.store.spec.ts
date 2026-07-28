import { TestBed } from '@angular/core/testing';
import { WishlistCompareStore } from './wishlist.store';
import { Product } from '@org/models';

describe('WishlistCompareStore', () => {
  let store: InstanceType<typeof WishlistCompareStore>;

  const product1: Product = {
    id: 'p1',
    name: 'Smartphone Pro',
    description: 'Flagship phone',
    price: 999.0,
    category: 'Electronics',
    imageUrl: 'https://example.com/p1.jpg',
    inStock: true,
    rating: 4.9,
    reviewCount: 300,
  };

  const product2: Product = {
    id: 'p2',
    name: 'Smartphone Mini',
    description: 'Compact phone',
    price: 699.0,
    category: 'Electronics',
    imageUrl: 'https://example.com/p2.jpg',
    inStock: true,
    rating: 4.6,
    reviewCount: 120,
  };

  const product3: Product = {
    id: 'p3',
    name: 'Budget Phone',
    description: 'Entry level phone',
    price: 299.0,
    category: 'Electronics',
    imageUrl: 'https://example.com/p3.jpg',
    inStock: false,
    rating: 4.1,
    reviewCount: 80,
  };

  const product4: Product = {
    id: 'p4',
    name: 'Tablet Max',
    description: 'Large display',
    price: 849.0,
    category: 'Electronics',
    imageUrl: 'https://example.com/p4.jpg',
    inStock: true,
    rating: 4.7,
    reviewCount: 210,
  };

  const product5: Product = {
    id: 'p5',
    name: 'Smart Watch',
    description: 'Fitness tracker',
    price: 199.0,
    category: 'Wearables',
    imageUrl: 'https://example.com/p5.jpg',
    inStock: true,
    rating: 4.3,
    reviewCount: 50,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WishlistCompareStore],
    });
    store = TestBed.inject(WishlistCompareStore);
  });

  it('should initialize with empty wishlist and compare state', () => {
    expect(store.wishlist()).toEqual([]);
    expect(store.compareList()).toEqual([]);
    expect(store.wishlistCount()).toBe(0);
    expect(store.compareCount()).toBe(0);
    expect(store.canAddToCompare()).toBe(true);
  });

  it('should toggle items in wishlist', () => {
    store.toggleWishlist(product1);
    expect(store.wishlist().length).toBe(1);
    expect(store.isWishlisted('p1')).toBe(true);

    store.toggleWishlist(product1);
    expect(store.wishlist().length).toBe(0);
    expect(store.isWishlisted('p1')).toBe(false);
  });

  it('should clear wishlist when clearWishlist() is called', () => {
    store.toggleWishlist(product1);
    store.toggleWishlist(product2);
    expect(store.wishlistCount()).toBe(2);

    store.clearWishlist();
    expect(store.wishlistCount()).toBe(0);
    expect(store.wishlist()).toEqual([]);
  });

  it('should compute wishlist total price', () => {
    store.toggleWishlist(product1); // 999
    store.toggleWishlist(product2); // 699
    expect(store.wishlistTotalValue()).toBe(1698);
  });

  it('should return empty stats matrix when compareList is empty', () => {
    const emptyMatrix = store.comparisonMatrix();
    expect(emptyMatrix.cheapestProduct).toBeNull();
    expect(emptyMatrix.highestRatedProduct).toBeNull();
    expect(emptyMatrix.inStockCount).toBe(0);
    expect(emptyMatrix.categories).toEqual([]);
  });

  it('should add products to comparison list up to limit 4 and handle duplicates', () => {
    expect(store.addToCompare(product1).success).toBe(true);
    // Duplicate add should return success and not duplicate item
    const duplicateAdd = store.addToCompare(product1);
    expect(duplicateAdd.success).toBe(true);
    expect(duplicateAdd.message).toBeUndefined();
    expect(store.compareCount()).toBe(1);

    expect(store.addToCompare(product2).success).toBe(true);
    expect(store.addToCompare(product3).success).toBe(true);
    expect(store.addToCompare(product4).success).toBe(true);

    expect(store.compareCount()).toBe(4);
    expect(store.canAddToCompare()).toBe(false);

    // Attempt adding 5th product
    const result = store.addToCompare(product5);
    expect(result.success).toBe(false);
    expect(result.message).toContain('Maximum 4 items');
    expect(store.compareCount()).toBe(4);
  });

  it('should calculate comparison matrix statistics with strict price and rating tie-breakers', () => {
    // Test with product1 (999, 4.9), product2 (699, 4.6), product3 (299, 4.1)
    store.addToCompare(product1);
    store.addToCompare(product2);
    store.addToCompare(product3);

    const matrix = store.comparisonMatrix();
    expect(matrix.cheapestProduct?.id).toBe('p3');
    expect(matrix.highestRatedProduct?.id).toBe('p1');
    expect(matrix.inStockCount).toBe(2);
    expect(matrix.categories).toEqual(['Electronics']);
  });

  it('should handle equal prices and ratings in comparison matrix consistently', () => {
    const pEqual1: Product = { ...product1, id: 'pe1', price: 500, rating: 4.5 };
    const pEqual2: Product = { ...product2, id: 'pe2', price: 500, rating: 4.5 };

    store.addToCompare(pEqual1);
    store.addToCompare(pEqual2);

    const matrix = store.comparisonMatrix();
    expect(matrix.cheapestProduct?.id).toBe('pe1');
    expect(matrix.highestRatedProduct?.id).toBe('pe1');
  });

  it('should remove items from comparison list and clear compare list', () => {
    store.addToCompare(product1);
    store.addToCompare(product2);
    expect(store.isCompared('p1')).toBe(true);

    store.removeFromCompare('p1');
    expect(store.isCompared('p1')).toBe(false);
    expect(store.compareCount()).toBe(1);

    store.clearCompare();
    expect(store.compareCount()).toBe(0);
  });
});
