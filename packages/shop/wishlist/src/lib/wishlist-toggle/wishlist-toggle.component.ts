import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistCompareStore } from '../store/wishlist.store';
import { Product } from '@org/models';

@Component({
  selector: 'lib-wishlist-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      *ngIf="product"
      (click)="store.toggleWishlist(product)"
      class="px-3 py-1 text-sm rounded border flex items-center space-x-1"
      [class.bg-red-100]="store.isWishlisted(product.id)"
      [class.text-red-600]="store.isWishlisted(product.id)"
      [class.border-red-300]="store.isWishlisted(product.id)"
    >
      <span>{{ store.isWishlisted(product.id) ? '♥ On Wishlist' : '♡ Add to Wishlist' }}</span>
    </button>
  `,
})
export class WishlistToggleComponent {
  @Input() product?: Product;
  readonly store = inject(WishlistCompareStore);
}
