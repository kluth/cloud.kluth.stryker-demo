import { TestBed } from '@angular/core/testing';
import { CheckoutStore } from './checkout.store';
import { CustomerInfo, ShippingAddress, PaymentDetails, CartItem, Product } from '@org/models';

describe('CheckoutStore', () => {
  let store: InstanceType<typeof CheckoutStore>;

  const mockProduct: Product = {
    id: 'p1',
    name: 'Wireless Speaker',
    description: 'Portable bluetooth speaker',
    price: 100.0,
    category: 'Audio',
    imageUrl: 'https://example.com/speaker.jpg',
    inStock: true,
    rating: 4.7,
    reviewCount: 45,
  };

  const mockCartItems: CartItem[] = [
    {
      product: mockProduct,
      quantity: 2,
      addedAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckoutStore],
    });
    store = TestBed.inject(CheckoutStore);
  });

  it('should initialize at step 1 (Customer Info)', () => {
    expect(store.currentStep()).toBe(1);
    expect(store.isCustomerInfoValid()).toBe(false);
    expect(store.isShippingAddressValid()).toBe(false);
    expect(store.isPaymentInfoValid()).toBe(false);
    expect(store.orderStatus()).toBe('IDLE');
  });

  it('should validate customer info fields', () => {
    const invalidInfo: CustomerInfo = {
      firstName: '',
      lastName: 'Doe',
      email: 'invalid-email',
      phone: '123',
    };
    store.updateCustomerInfo(invalidInfo);
    expect(store.isCustomerInfoValid()).toBe(false);

    const validInfo: CustomerInfo = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-0199',
    };
    store.updateCustomerInfo(validInfo);
    expect(store.isCustomerInfoValid()).toBe(true);
  });

  it('should validate shipping address fields including whitespace checks', () => {
    const invalidAddress: ShippingAddress = {
      street: '   ',
      city: 'Tech City',
      state: 'CA',
      zipCode: '90210',
      country: 'USA',
    };
    store.updateShippingAddress(invalidAddress);
    expect(store.isShippingAddressValid()).toBe(false);

    const validAddress: ShippingAddress = {
      street: '123 Main St',
      city: 'Tech City',
      state: 'CA',
      zipCode: '90210',
      country: 'USA',
    };
    store.updateShippingAddress(validAddress);
    expect(store.isShippingAddressValid()).toBe(true);
  });

  it('should allow selecting shipping method', () => {
    expect(store.selectedShippingMethod().id).toBe('standard');
    expect(store.selectedShippingMethod().cost).toBe(4.99);

    store.selectShippingMethod('express');
    expect(store.selectedShippingMethod().id).toBe('express');
    expect(store.selectedShippingMethod().cost).toBe(14.99);

    store.selectShippingMethod('overnight');
    expect(store.selectedShippingMethod().id).toBe('overnight');
    expect(store.selectedShippingMethod().cost).toBe(29.99);
  });

  it('should validate payment details with Luhn algorithm for credit card, PayPal, and Invoice', () => {
    // Invalid card number (fails Luhn algorithm)
    const invalidPayment: PaymentDetails = {
      method: 'CREDIT_CARD',
      cardNumber: '4000000000000001',
      cardHolder: 'John Doe',
      expiryDate: '12/28',
      cvv: '123',
    };
    store.updatePaymentInfo(invalidPayment);
    expect(store.isPaymentInfoValid()).toBe(false);

    // Valid card number (passes Luhn algorithm: 4532015112830366)
    const validPayment: PaymentDetails = {
      method: 'CREDIT_CARD',
      cardNumber: '4532015112830366',
      cardHolder: 'John Doe',
      expiryDate: '12/28',
      cvv: '123',
    };
    store.updatePaymentInfo(validPayment);
    expect(store.isPaymentInfoValid()).toBe(true);

    // PayPal validation
    store.updatePaymentInfo({ method: 'PAYPAL', paypalEmail: 'invalid' });
    expect(store.isPaymentInfoValid()).toBe(false);

    store.updatePaymentInfo({ method: 'PAYPAL', paypalEmail: 'user@example.com' });
    expect(store.isPaymentInfoValid()).toBe(true);

    // Invoice validation
    store.updatePaymentInfo({ method: 'INVOICE' });
    expect(store.isPaymentInfoValid()).toBe(true);
  });

  it('should prevent advancing step if current step is invalid and allow step navigation', () => {
    expect(store.nextStep()).toBe(false);
    expect(store.currentStep()).toBe(1);

    store.updateCustomerInfo({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '555-1234567',
    });
    expect(store.isCustomerInfoValid()).toBe(true);

    expect(store.nextStep()).toBe(true);
    expect(store.currentStep()).toBe(2);

    // Test prevStep
    store.prevStep();
    expect(store.currentStep()).toBe(1);

    store.prevStep(); // Should not go below step 1
    expect(store.currentStep()).toBe(1);
  });

  it('should calculate grand total for order summary', () => {
    const itemSubtotal = 200; // 2 * $100
    const shippingCost = 14.99; // Express shipping
    store.selectShippingMethod('express');

    const grandTotal = store.calculateGrandTotal(itemSubtotal);
    const expectedTax = +(itemSubtotal * 0.19).toFixed(2);
    expect(grandTotal).toBe(+(itemSubtotal + expectedTax + shippingCost).toFixed(2));
  });

  it('should handle order submission failure when data is incomplete', () => {
    const result = store.submitOrder(mockCartItems, 200);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid checkout information');
    expect(store.orderStatus()).toBe('FAILED');
  });

  it('should submit order successfully and produce order confirmation', () => {
    store.updateCustomerInfo({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '555-0101',
    });
    store.updateShippingAddress({
      street: '456 Market St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA',
    });
    store.updatePaymentInfo({
      method: 'CREDIT_CARD',
      cardNumber: '4532015112830366',
      cardHolder: 'John Doe',
      expiryDate: '12/28',
      cvv: '123',
    });

    const result = store.submitOrder(mockCartItems, 200);
    expect(result.success).toBe(true);
    expect(store.orderStatus()).toBe('CONFIRMED');
    expect(store.orderConfirmation()?.orderId).toBeDefined();
    expect(store.orderConfirmation()?.items.length).toBe(1);
  });
});
