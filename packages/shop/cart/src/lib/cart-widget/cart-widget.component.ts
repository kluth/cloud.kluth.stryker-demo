import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartStore } from '../store/cart.store';

@Component({
  selector: 'lib-cart-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cart-widget bg-white p-4 rounded-lg shadow-md">
      <div class="flex items-center justify-between border-b pb-2 mb-3">
        <h3 class="text-lg font-bold">Warenkorb ({{ cartStore.itemCount() }})</h3>
        <span class="text-sm font-semibold text-indigo-600">
          {{ cartStore.convertedTotal() }} {{ cartStore.targetCurrency() }}
        </span>
      </div>

      <div *ngIf="cartStore.isEmpty()" class="text-center text-gray-500 py-4">
        Dein Warenkorb ist leer.
      </div>

      <div *ngIf="!cartStore.isEmpty()" class="space-y-3">
        <div
          *ngFor="let item of cartStore.items()"
          class="flex items-center justify-between py-2 border-b text-sm"
        >
          <div>
            <div class="font-medium">{{ item.product.name }}</div>
            <div class="text-xs text-gray-500">
              {{ item.product.price }} € x {{ item.quantity }}
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button
              (click)="cartStore.updateQuantity(item.product.id, item.quantity - 1)"
              class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              -
            </button>
            <span>{{ item.quantity }}</span>
            <button
              (click)="cartStore.addItem(item.product, 1)"
              class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              +
            </button>
            <button
              (click)="cartStore.removeItem(item.product.id)"
              class="text-red-500 hover:text-red-700 ml-2"
            >
              &times;
            </button>
          </div>
        </div>

        <div class="pt-2 text-xs space-y-1">
          <div class="flex justify-between">
            <span>Zwischensumme:</span>
            <span>{{ cartStore.rawSubtotal() }} €</span>
          </div>
          <div *ngIf="cartStore.discountAmount() > 0" class="flex justify-between text-green-600">
            <span>Rabatt ({{ cartStore.couponCode() }}):</span>
            <span>-{{ cartStore.discountAmount() }} €</span>
          </div>
          <div class="flex justify-between">
            <span>Versand:</span>
            <span>{{ cartStore.shippingCost() === 0 ? 'Kostenlos' : cartStore.shippingCost() + ' €' }}</span>
          </div>
          <div class="flex justify-between font-bold text-sm pt-2 border-t">
            <span>Gesamtsumme (inkl. MwSt):</span>
            <span>{{ cartStore.total() }} €</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CartWidgetComponent {
  readonly cartStore = inject(CartStore);
}
