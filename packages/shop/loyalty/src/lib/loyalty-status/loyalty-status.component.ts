import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoyaltyStore } from '../store/loyalty.store';

@Component({
  selector: 'lib-loyalty-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loyalty-status p-4 bg-gradient-to-r from-amber-500 to-amber-700 text-white rounded-xl shadow-lg">
      <div class="flex justify-between items-center mb-2">
        <div>
          <span class="text-xs uppercase tracking-wider text-amber-200 font-bold">Loyalty Status</span>
          <h3 class="text-xl font-extrabold">{{ store.currentTier() }} Level</h3>
        </div>
        <div class="text-right">
          <span class="text-2xl font-bold">{{ store.pointsBalance() }}</span>
          <span class="text-xs block text-amber-200">Punkte verfügbar</span>
        </div>
      </div>

      <div class="w-full bg-amber-900/40 h-2 rounded-full overflow-hidden my-3">
        <div
          class="bg-amber-300 h-full transition-all duration-300"
          [style.width.%]="store.tierProgressPercentage()"
        ></div>
      </div>

      <div class="text-xs flex justify-between text-amber-100">
        <span>Multiplikator: {{ store.tierMultiplier() }}x</span>
        <span *ngIf="store.pointsToNextTier() > 0">
          Noch {{ store.pointsToNextTier() }} Punkte bis zum nächsten Level
        </span>
      </div>
    </div>
  `,
})
export class LoyaltyStatusComponent {
  readonly store = inject(LoyaltyStore);
}
