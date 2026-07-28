import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import {
  CustomerInfo,
  ShippingAddress,
  ShippingMethod,
  PaymentDetails,
  OrderConfirmation,
  CartItem,
} from '@org/models';

export interface CheckoutState {
  currentStep: 1 | 2 | 3 | 4;
  customerInfo: CustomerInfo;
  shippingAddress: ShippingAddress;
  selectedShippingMethod: ShippingMethod;
  paymentInfo: PaymentDetails;
  orderStatus: 'IDLE' | 'PROCESSING' | 'CONFIRMED' | 'FAILED';
  orderConfirmation: OrderConfirmation | null;
}

const initialState: CheckoutState = {
  currentStep: 1,
  customerInfo: { firstName: '', lastName: '', email: '', phone: '' },
  shippingAddress: { street: '', city: '', state: '', zipCode: '', country: '' },
  selectedShippingMethod: {
    id: 'standard',
    name: 'Standard Shipping',
    cost: 4.99,
    estimatedDays: 5,
  },
  paymentInfo: { method: 'CREDIT_CARD' },
  orderStatus: 'IDLE',
  orderConfirmation: null,
};

const SHIPPING_METHODS: Record<string, ShippingMethod> = {
  standard: { id: 'standard', name: 'Standard Shipping', cost: 4.99, estimatedDays: 5 },
  express: { id: 'express', name: 'Express Shipping', cost: 14.99, estimatedDays: 2 },
  overnight: { id: 'overnight', name: 'Overnight Express', cost: 29.99, estimatedDays: 1 },
};

function isLuhnValid(cardNumber: string): boolean {
  const sanitized = cardNumber.replace(/\D/g, '');
  if (sanitized.length < 13 || sanitized.length > 19) return false;
  let sum = 0;
  let shouldDouble = false;

  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export const CheckoutStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => {
    const isCustomerInfoValid = () => {
      const info = store.customerInfo();
      return (
        info.firstName.trim().length > 0 &&
        info.lastName.trim().length > 0 &&
        info.email.includes('@') &&
        info.email.includes('.') &&
        info.phone.trim().length >= 7
      );
    };

    const isShippingAddressValid = () => {
      const addr = store.shippingAddress();
      return (
        addr.street.trim().length > 0 &&
        addr.city.trim().length > 0 &&
        addr.state.trim().length > 0 &&
        addr.zipCode.trim().length > 0 &&
        addr.country.trim().length > 0
      );
    };

    const isPaymentInfoValid = () => {
      const pay = store.paymentInfo();
      if (pay.method === 'PAYPAL') {
        return !!pay.paypalEmail && pay.paypalEmail.includes('@');
      }
      if (pay.method === 'INVOICE') {
        return true;
      }
      // CREDIT_CARD
      if (!pay.cardNumber || !pay.cardHolder || !pay.expiryDate || !pay.cvv) {
        return false;
      }
      if (!pay.cvv.match(/^\d{3,4}$/)) return false;
      return isLuhnValid(pay.cardNumber);
    };

    return {
      isCustomerInfoValid,
      isShippingAddressValid,
      isPaymentInfoValid,
    };
  }),
  withMethods((store) => ({
    isStepValid(step: number): boolean {
      if (step === 1) return store.isCustomerInfoValid();
      if (step === 2) return store.isShippingAddressValid();
      if (step === 3) return store.isPaymentInfoValid();
      return true;
    },

    updateCustomerInfo(info: CustomerInfo) {
      patchState(store, { customerInfo: info });
    },

    updateShippingAddress(address: ShippingAddress) {
      patchState(store, { shippingAddress: address });
    },

    selectShippingMethod(methodId: 'standard' | 'express' | 'overnight') {
      const method = SHIPPING_METHODS[methodId];
      if (method) {
        patchState(store, { selectedShippingMethod: method });
      }
    },

    updatePaymentInfo(payment: PaymentDetails) {
      patchState(store, { paymentInfo: payment });
    },

    nextStep(): boolean {
      const step = store.currentStep();
      if (!this.isStepValid(step)) {
        return false;
      }
      if (step < 4) {
        patchState(store, { currentStep: (step + 1) as 1 | 2 | 3 | 4 });
        return true;
      }
      return false;
    },

    prevStep() {
      const step = store.currentStep();
      if (step > 1) {
        patchState(store, { currentStep: (step - 1) as 1 | 2 | 3 | 4 });
      }
    },

    calculateGrandTotal(itemSubtotal: number): number {
      const tax = +(itemSubtotal * 0.19).toFixed(2);
      const shipping = store.selectedShippingMethod().cost;
      return +(itemSubtotal + tax + shipping).toFixed(2);
    },

    submitOrder(cartItems: CartItem[], itemSubtotal: number): { success: boolean; message?: string } {
      if (!store.isCustomerInfoValid() || !store.isShippingAddressValid() || !store.isPaymentInfoValid()) {
        patchState(store, { orderStatus: 'FAILED' });
        return { success: false, message: 'Invalid checkout information' };
      }

      const confirmation: OrderConfirmation = {
        orderId: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        items: cartItems,
        shippingAddress: store.shippingAddress(),
        shippingMethod: store.selectedShippingMethod(),
        paymentMethod: store.paymentInfo().method,
        totalAmount: this.calculateGrandTotal(itemSubtotal),
        status: 'CONFIRMED',
      };

      patchState(store, {
        orderStatus: 'CONFIRMED',
        orderConfirmation: confirmation,
      });

      return { success: true };
    },
  }))
);
