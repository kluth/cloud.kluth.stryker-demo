import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutStore } from '../store/checkout.store';

@Component({
  selector: 'lib-checkout-wizard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="checkout-wizard bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <div class="flex border-b pb-4 mb-6 justify-between text-sm font-medium">
        <span [class.text-indigo-600]="store.currentStep() === 1">1. Customer Info</span>
        <span [class.text-indigo-600]="store.currentStep() === 2">2. Shipping</span>
        <span [class.text-indigo-600]="store.currentStep() === 3">3. Payment</span>
        <span [class.text-indigo-600]="store.currentStep() === 4">4. Confirmation</span>
      </div>

      <div [ngSwitch]="store.currentStep()">
        <div *ngSwitchCase="1">
          <h4 class="font-bold text-lg mb-2">Kundendaten</h4>
          <p class="text-sm text-gray-600 mb-4">Schritt 1 von 4: Persönliche Details eingeben.</p>
        </div>
        <div *ngSwitchCase="2">
          <h4 class="font-bold text-lg mb-2">Lieferadresse & Versand</h4>
          <p class="text-sm text-gray-600 mb-4">Schritt 2 von 4: Adresse & Versandoptionen.</p>
        </div>
        <div *ngSwitchCase="3">
          <h4 class="font-bold text-lg mb-2">Zahlungsart</h4>
          <p class="text-sm text-gray-600 mb-4">Schritt 3 von 4: Wählen Sie Ihre Zahlungsmethode.</p>
        </div>
        <div *ngSwitchCase="4">
          <h4 class="font-bold text-lg mb-2">Bestellübersicht</h4>
          <p class="text-sm text-gray-600 mb-4">Schritt 4 von 4: Bitte überprüfen Sie Ihre Daten.</p>
        </div>
      </div>
    </div>
  `,
})
export class CheckoutWizardComponent {
  readonly store = inject(CheckoutStore);
}
