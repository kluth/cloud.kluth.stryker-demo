import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { CartItem, Coupon, SupportedCurrency, Product, ProductVariant } from '@org/models';

export interface CartState {
  items: CartItem[];
  couponCode: string | null;
  appliedDiscount: Coupon | null;
  targetCurrency: SupportedCurrency;
}

const initialState: CartState = {
  items: [],
  couponCode: null,
  appliedDiscount: null,
  targetCurrency: 'USD',
};

const VALID_COUPONS: Record<string, Coupon> = {
  SAVE10: { code: 'SAVE10', type: 'PERCENTAGE', value: 10 },
  SAVE20: { code: 'SAVE20', type: 'FIXED', value: 20 },
  FREESHIP: { code: 'FREESHIP', type: 'FREESHIP', value: 0 },
};

const CURRENCY_RATES: Record<SupportedCurrency, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
};

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => {
    const rawSubtotal = () =>
      store.items().reduce((acc, item) => {
        const itemPrice =
          item.product.price + (item.selectedVariant?.additionalPrice || 0);
        return acc + itemPrice * item.quantity;
      }, 0);

    const discountAmount = () => {
      const discount = store.appliedDiscount();
      if (!discount) return 0;
      const subtotal = rawSubtotal();
      if (discount.type === 'PERCENTAGE') {
        return +((subtotal * discount.value) / 100).toFixed(2);
      }
      if (discount.type === 'FIXED') {
        return Math.min(subtotal, discount.value);
      }
      return 0;
    };

    const netSubtotal = () => Math.max(0, rawSubtotal() - discountAmount());

    const isEligibleForFreeShipping = () => {
      const discount = store.appliedDiscount();
      if (discount?.type === 'FREESHIP') return true;
      return netSubtotal() >= 100;
    };

    const freeShippingRemaining = () => {
      if (isEligibleForFreeShipping()) return 0;
      return +(100 - netSubtotal()).toFixed(2);
    };

    const shippingCost = () => {
      if (store.items().length === 0) return 0;
      return isEligibleForFreeShipping() ? 0 : 5.99;
    };

    const taxAmount = () => +((netSubtotal() * 0.19)).toFixed(2);

    const total = () =>
      +(netSubtotal() + taxAmount() + shippingCost()).toFixed(2);

    const convertedTotal = () => {
      const rate = CURRENCY_RATES[store.targetCurrency()] || 1.0;
      return +(total() * rate).toFixed(2);
    };

    const itemCount = () =>
      store.items().reduce((acc, item) => acc + item.quantity, 0);

    const isEmpty = () => store.items().length === 0;

    return {
      rawSubtotal,
      discountAmount,
      netSubtotal,
      isEligibleForFreeShipping,
      freeShippingRemaining,
      shippingCost,
      taxAmount,
      total,
      convertedTotal,
      itemCount,
      isEmpty,
    };
  }),
  withMethods((store) => ({
    addItem(product: Product, quantity = 1, selectedVariant?: ProductVariant) {
      const currentItems = store.items();
      const existingIndex = currentItems.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedVariant?.id === selectedVariant?.id
      );

      if (existingIndex > -1) {
        const updated = [...currentItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        patchState(store, { items: updated });
      } else {
        const newItem: CartItem = {
          product,
          quantity,
          selectedVariant,
          addedAt: new Date().toISOString(),
        };
        patchState(store, { items: [...currentItems, newItem] });
      }
    },

    removeItem(productId: string, variantId?: string) {
      const updated = store
        .items()
        .filter(
          (item) =>
            !(
              item.product.id === productId &&
              (!variantId || item.selectedVariant?.id === variantId)
            )
        );
      patchState(store, { items: updated });
    },

    updateQuantity(productId: string, quantity: number, variantId?: string) {
      if (quantity <= 0) {
        this.removeItem(productId, variantId);
        return;
      }
      const updated = store.items().map((item) => {
        if (
          item.product.id === productId &&
          (!variantId || item.selectedVariant?.id === variantId)
        ) {
          return { ...item, quantity };
        }
        return item;
      });
      patchState(store, { items: updated });
    },

    applyCoupon(code: string): { success: boolean; message: string } {
      const coupon = VALID_COUPONS[code.toUpperCase()];
      if (!coupon) {
        return { success: false, message: 'Invalid coupon code' };
      }
      patchState(store, {
        couponCode: coupon.code,
        appliedDiscount: coupon,
      });
      return { success: true, message: 'Coupon applied successfully' };
    },

    removeCoupon() {
      patchState(store, { couponCode: null, appliedDiscount: null });
    },

    setCurrency(currency: SupportedCurrency) {
      patchState(store, { targetCurrency: currency });
    },

    clearCart() {
      patchState(store, {
        items: [],
        couponCode: null,
        appliedDiscount: null,
      });
    },
  }))
);
