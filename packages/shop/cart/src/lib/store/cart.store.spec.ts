import { TestBed } from '@angular/core/testing';
import { CartStore } from './cart.store';
import { Product } from '@org/models';

describe('CartStore', () => {
  let store: InstanceType<typeof CartStore>;

  const mockProductA: Product = {
    id: 'p1',
    name: 'Wireless Headphones',
    description: 'High quality sound',
    price: 120.0,
    category: 'Electronics',
    imageUrl: 'https://example.com/p1.jpg',
    inStock: true,
    rating: 4.8,
    reviewCount: 150,
  };

  const mockProductB: Product = {
    id: 'p2',
    name: 'Mechanical Keyboard',
    description: 'RGB switches',
    price: 80.0,
    category: 'Electronics',
    imageUrl: 'https://example.com/p2.jpg',
    inStock: true,
    rating: 4.5,
    reviewCount: 90,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartStore],
    });
    store = TestBed.inject(CartStore);
  });

  it('should initialize with default empty state', () => {
    expect(store.items()).toEqual([]);
    expect(store.couponCode()).toBeNull();
    expect(store.targetCurrency()).toBe('USD');
    expect(store.itemCount()).toBe(0);
    expect(store.isEmpty()).toBe(true);
    expect(store.rawSubtotal()).toBe(0);
  });

  it('should add items to cart and increment quantity if product already exists', () => {
    store.addItem(mockProductA, 1);
    expect(store.items().length).toBe(1);
    expect(store.items()[0].quantity).toBe(1);
    expect(store.itemCount()).toBe(1);

    store.addItem(mockProductA, 2);
    expect(store.items().length).toBe(1);
    expect(store.items()[0].quantity).toBe(3);
    expect(store.itemCount()).toBe(3);
  });

  it('should treat different variants of the same product as separate items', () => {
    const variantBlack = { id: 'v-black', name: 'Black' };
    const variantWhite = { id: 'v-white', name: 'White', additionalPrice: 10 };

    store.addItem(mockProductA, 1, variantBlack);
    store.addItem(mockProductA, 1, variantWhite);

    expect(store.items().length).toBe(2);
    expect(store.rawSubtotal()).toBe(120 + 130);
  });

  it('should remove items from cart', () => {
    store.addItem(mockProductA, 2);
    store.addItem(mockProductB, 1);

    store.removeItem('p1');
    expect(store.items().length).toBe(1);
    expect(store.items()[0].product.id).toBe('p2');
  });

  it('should update quantity and remove item if set to 0 or negative', () => {
    store.addItem(mockProductA, 3);
    store.updateQuantity('p1', 5);
    expect(store.items()[0].quantity).toBe(5);

    store.updateQuantity('p1', 0);
    expect(store.items().length).toBe(0);
  });

  it('should calculate rawSubtotal, netSubtotal, taxAmount (19%), shipping, and total', () => {
    // mockProductA = 120, mockProductB = 80
    store.addItem(mockProductA, 1); // 120 -> netSubtotal >= $100 -> free shipping ($0)
    expect(store.rawSubtotal()).toBe(120);
    expect(store.shippingCost()).toBe(0);
    expect(store.isEligibleForFreeShipping()).toBe(true);

    const expectedTax = +(120 * 0.19).toFixed(2); // 22.8
    expect(store.taxAmount()).toBe(expectedTax);
    expect(store.total()).toBe(+(120 + expectedTax).toFixed(2));
  });

  it('should calculate shipping fee when subtotal is below free shipping threshold ($100)', () => {
    store.addItem(mockProductB, 1); // 80 -> below $100
    expect(store.shippingCost()).toBe(5.99);
    expect(store.isEligibleForFreeShipping()).toBe(false);
    expect(store.freeShippingRemaining()).toBe(20);
  });

  it('should apply PERCENTAGE coupon correctly (SAVE10 -> 10% off)', () => {
    store.addItem(mockProductA, 1); // 120
    const result = store.applyCoupon('SAVE10');

    expect(result.success).toBe(true);
    expect(store.discountAmount()).toBe(12);
    expect(store.netSubtotal()).toBe(108);
  });

  it('should apply FIXED coupon correctly (SAVE20 -> $20 off)', () => {
    store.addItem(mockProductA, 1); // 120
    const result = store.applyCoupon('SAVE20');

    expect(result.success).toBe(true);
    expect(store.discountAmount()).toBe(20);
    expect(store.netSubtotal()).toBe(100);
  });

  it('should apply FREESHIP coupon and make shipping $0 even below $100 threshold', () => {
    store.addItem(mockProductB, 1); // $80
    expect(store.shippingCost()).toBe(5.99);

    const result = store.applyCoupon('FREESHIP');
    expect(result.success).toBe(true);
    expect(store.shippingCost()).toBe(0);
  });

  it('should reject invalid or inapplicable coupon codes', () => {
    const result = store.applyCoupon('INVALID_CODE');
    expect(result.success).toBe(false);
    expect(store.couponCode()).toBeNull();
  });

  it('should remove coupon when removeCoupon is called', () => {
    store.addItem(mockProductA, 1);
    store.applyCoupon('SAVE10');
    expect(store.couponCode()).toBe('SAVE10');

    store.removeCoupon();
    expect(store.couponCode()).toBeNull();
    expect(store.discountAmount()).toBe(0);
  });

  it('should convert convertedTotal according to selected currency rate', () => {
    store.addItem(mockProductA, 1); // 120 + 22.8 tax = 142.8 USD
    store.setCurrency('EUR'); // 0.92 multiplier
    const totalUSD = store.total();
    const expectedEUR = +(totalUSD * 0.92).toFixed(2);
    expect(store.convertedTotal()).toBe(expectedEUR);

    store.setCurrency('GBP'); // 0.79 multiplier
    const expectedGBP = +(totalUSD * 0.79).toFixed(2);
    expect(store.convertedTotal()).toBe(expectedGBP);
  });

  it('should clear cart on clearCart()', () => {
    store.addItem(mockProductA, 2);
    store.applyCoupon('SAVE10');
    store.clearCart();

    expect(store.items().length).toBe(0);
    expect(store.couponCode()).toBeNull();
    expect(store.itemCount()).toBe(0);
  });
});
